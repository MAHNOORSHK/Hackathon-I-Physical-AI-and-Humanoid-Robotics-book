from groq import Groq
from typing import Optional

class AIService:
    def __init__(self, groq_api_key: str):
        self.groq_client = Groq(api_key=groq_api_key)

    def personalize_content(self, content: str, software_background: Optional[str], hardware_background: Optional[str]) -> str:
        try:
            prompt = (
                f"Rewrite the following textbook content to be suitable for a user with "
                f"software background: '{software_background or 'not specified'}' and "
                f"hardware background: '{hardware_background or 'not specified'}'.\n\n"
                f"Original Content:\n{content}\n\n"
                f"Rewritten Content:"
            )
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2048
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Failed to personalize content: {str(e)}")

    def translate_content(self, content: str, target_language: str) -> str:
        try:
            prompt = (
                f"Translate the following English textbook content to {target_language}.\n\n"
                f"Original Content:\n{content}\n\n"
                f"Translated Content:"
            )
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2048
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Failed to translate content: {str(e)}")
