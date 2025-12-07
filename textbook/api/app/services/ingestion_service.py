import os
import openai
from qdrant_client import QdrantClient, models
from langchain.text_splitter import MarkdownTextSplitter

class IngestionService:
    def __init__(self, openai_api_key: str, qdrant_url: str, qdrant_api_key: str):
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
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

    def _get_embeddings(self, texts: list[str], model="text-embedding-ada-002") -> list[list[float]]:
        response = self.openai_client.embeddings.create(input=texts, model=model)
        return [embedding.embedding for embedding in response.data]

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

        # 3. Create Qdrant collection if it doesn't exist
        try:
            self.qdrant_client.get_collection(collection_name=self.collection_name)
        except Exception:
            self.qdrant_client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
            )

        # 4. Generate embeddings and upsert into Qdrant
        batch_size = 32
        for i in range(0, len(chunks), batch_size):
            batch_chunks = chunks[i:i+batch_size]
            embeddings = self._get_embeddings(batch_chunks)
            
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
