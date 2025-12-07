import openai
from typing import Optional

class AIService:
    def __init__(self, openai_api_key: str):
        # Initialize OpenAI client here, not using global openai.api_key
        self.client = openai.OpenAI(api_key=openai_api_key)

    def personalize_content(self, content: str, software_experience: Optional[str], hardware_experience: Optional[str]) -> str:
        prompt = (
            f"Rewrite the following textbook content to be suitable for a user with "
            f"software experience: '{software_experience or 'not specified'}' and "
            f"hardware experience: '{hardware_experience or 'not specified'}'.\n\n"
            f"Original Content:\n{content}\n\n"
            f"Rewritten Content:"
        )
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo", # Using a chat model
            messages=[
                {"role": "system", "content": "You are a helpful assistant that rewrites content."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()

    def translate_content(self, content: str, target_language: str) -> str:
        prompt = (
            f"Translate the following English textbook content to {target_language}.\n\n"
            f"Original Content:\n{content}\n\n"
            f"Translated Content:"
        )
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo", # Using a chat model
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that translates content to {target_language}."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()
