import google.generativeai as genai
from typing import Optional

class AIService:
    def __init__(self, google_api_key: str):
        genai.configure(api_key=google_api_key)
        # Using gemini-2.5-flash as gemini-2.0-flash has quota issues
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def personalize_content(self, content: str, software_background: Optional[str], hardware_background: Optional[str]) -> str:
        try:
            prompt = (
                f"Rewrite the following textbook content to be suitable for a user with "
                f"software background: '{software_background or 'not specified'}' and "
                f"hardware background: '{hardware_background or 'not specified'}'.\n\n"
                f"Original Content:\n{content}\n\n"
                f"Rewritten Content:"
            )
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                raise Exception("API quota exceeded. Please try again later or contact support.")
            raise Exception(f"Failed to personalize content: {error_msg}")

    def translate_content(self, content: str, target_language: str) -> str:
        try:
            prompt = (
                f"Translate the following English textbook content to {target_language}.\n\n"
                f"Original Content:\n{content}\n\n"
                f"Translated Content:"
            )
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                raise Exception("API quota exceeded. Please try again later or contact support.")
            raise Exception(f"Failed to translate content: {error_msg}")
