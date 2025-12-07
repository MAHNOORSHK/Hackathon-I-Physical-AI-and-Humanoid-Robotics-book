import openai
from qdrant_client import QdrantClient

class RAGService:
    def __init__(self, openai_api_key: str, qdrant_host: str, qdrant_api_key: str):
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        self.qdrant_client = QdrantClient(host=qdrant_host, api_key=qdrant_api_key)
        self.collection_name = "textbook_content"

    def _get_embedding(self, text: str, model="text-embedding-ada-002") -> list[float]:
        response = self.openai_client.embeddings.create(input=[text], model=model)
        return response.data[0].embedding

    def _retrieve_documents(self, query_embedding: list[float], limit: int = 3) -> list[str]:
        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit,
            with_payload=True,
        )
        return [hit.payload["text"] for hit in search_result]

    def _build_prompt(self, query: str, documents: list[str]) -> str:
        context = "\n\n".join(documents)
        prompt = (
            f"You are an AI assistant for a textbook on Physical AI & Humanoid Robotics.\n"
            f"Answer the following question based only on the provided context.\n"
            f"If the answer cannot be found in the context, respond with 'I don't have enough information to answer that question based on the provided textbook content.'\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n"
            f"Answer:"
        )
        return prompt

    def query(self, text: str) -> str:
        # 1. Embed the query
        query_embedding = self._get_embedding(text)

        # 2. Search Qdrant for relevant documents
        relevant_documents = self._retrieve_documents(query_embedding)

        # 3. Build prompt for LLM
        prompt = self._build_prompt(text, relevant_documents)

        # 4. Use OpenAI to generate a response
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
        )
        return response.choices[0].message.content

    def query_with_context(self, text: str, context: str) -> str:
        relevant_documents = [context]
        prompt = self._build_prompt(text, relevant_documents)
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
        )
        return response.choices[0].message.content