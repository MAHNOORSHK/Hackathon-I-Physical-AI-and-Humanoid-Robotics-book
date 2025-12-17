from groq import Groq
from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import UnexpectedResponse
import google.generativeai as genai

class RAGService:
    def __init__(self, groq_api_key: str, google_api_key: str, qdrant_url: str, qdrant_api_key: str):
        # Groq for chat (free, high limits)
        self.groq_client = Groq(api_key=groq_api_key)

        # Google for embeddings only
        genai.configure(api_key=google_api_key)

        self.qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
        self.collection_name = "textbook_content"

    def _get_embedding(self, text: str) -> list[float]:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']

    def _retrieve_documents(self, query_embedding: list[float], limit: int = 3) -> list[str]:
        try:
            search_result = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit,
                with_payload=True,
            )
            return [hit.payload["text"] for hit in search_result]
        except UnexpectedResponse as e:
            print(f"Qdrant search error: {e}")
            return []
        except Exception as e:
            print(f"Error retrieving documents: {e}")
            return []

    def _build_prompt(self, query: str, documents: list[str]) -> str:
        if not documents:
            return (
                f"You are an AI assistant for a textbook on Physical AI & Humanoid Robotics.\n"
                f"The textbook content has not been indexed yet. Please answer the question based on your general knowledge about Physical AI, Humanoid Robotics, ROS 2, NVIDIA Isaac, Gazebo simulation, and related topics.\n\n"
                f"Question: {query}\n"
                f"Answer:"
            )

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
        try:
            # 1. Embed the query
            query_embedding = self._get_embedding(text)

            # 2. Search Qdrant for relevant documents
            relevant_documents = self._retrieve_documents(query_embedding)

            # 3. Build prompt for LLM
            prompt = self._build_prompt(text, relevant_documents)

            # 4. Use Groq to generate a response (free, high limits)
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1024
            )
            return response.choices[0].message.content
        except Exception as e:
            error_msg = str(e)
            print(f"DEBUG ERROR: {error_msg}")
            return f"Error: {error_msg}"

    def query_with_context(self, text: str, context: str) -> str:
        try:
            relevant_documents = [context]
            prompt = self._build_prompt(text, relevant_documents)

            # Use Groq for response
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1024
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Sorry, I encountered an error processing your request: {str(e)}"