import os
import google.generativeai as genai
from qdrant_client import QdrantClient, models
from langchain_text_splitters import MarkdownTextSplitter

class IngestionService:
    def __init__(self, google_api_key: str, qdrant_url: str, qdrant_api_key: str):
        genai.configure(api_key=google_api_key)
        self.qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
        self.collection_name = "textbook_content"
        self.text_splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=100)

    def _get_all_markdown_files(self, docs_path: str) -> list[str]:
        markdown_files = []
        for root, _, files in os.walk(docs_path):
            for file in files:
                if file.endswith(".md"):
                    markdown_files.append(os.path.join(root, file))
        return markdown_files

    def _get_embedding(self, text: str) -> list[float]:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    def _get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        embeddings = []
        for text in texts:
            embeddings.append(self._get_embedding(text))
        return embeddings

    def ingest_book_content(self, book_path: str):
        docs_path = os.path.join(book_path, "docs")
        markdown_files = self._get_all_markdown_files(docs_path)

        # 1. Read all markdown files
        all_text = ""
        for file_path in markdown_files:
            with open(file_path, "r", encoding="utf-8") as f:
                all_text += f.read() + "\n\n"

        # 2. Chunk the text
        chunks = self.text_splitter.split_text(all_text)

        # 3. Recreate Qdrant collection (to ensure correct dimensions)
        # Google text-embedding-004 produces 768 dimensions
        try:
            self.qdrant_client.delete_collection(collection_name=self.collection_name)
        except Exception:
            pass  # Collection may not exist

        self.qdrant_client.create_collection(
            collection_name=self.collection_name,
            vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE),
        )

        # 4. Generate embeddings and upsert into Qdrant
        batch_size = 10  # Smaller batch for API rate limits
        for i in range(0, len(chunks), batch_size):
            batch_chunks = chunks[i:i+batch_size]
            embeddings = self._get_embeddings_batch(batch_chunks)

            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=models.Batch(
                    ids=[i+j for j in range(len(batch_chunks))],
                    vectors=embeddings,
                    payloads=[{"text": chunk} for chunk in batch_chunks]
                ),
                wait=True
            )

        print(f"Successfully ingested {len(chunks)} chunks into Qdrant collection '{self.collection_name}'.")
