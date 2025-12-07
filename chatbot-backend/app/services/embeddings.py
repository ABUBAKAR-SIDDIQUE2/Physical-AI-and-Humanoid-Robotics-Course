import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBEDDING_MODEL = "text-embedding-004"

async def get_embedding(text: str) -> list[float]:
    """Generates embeddings using Gemini (Async)."""
    response = await client.aio.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text
    )
    return response.embeddings[0].values
