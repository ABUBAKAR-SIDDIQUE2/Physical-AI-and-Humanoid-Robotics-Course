import os
from qdrant_client import QdrantClient, AsyncQdrantClient
from qdrant_client.http.models import Distance, VectorParams
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_PATH = os.getenv("QDRANT_PATH")

COLLECTION_NAME = "physical_ai_book"
VECTOR_SIZE = 768  # Gemini text-embedding-004

def get_qdrant_client() -> QdrantClient:
    """Returns a configured QdrantClient."""
    if QDRANT_PATH:
        return QdrantClient(path=QDRANT_PATH)
    if QDRANT_API_KEY:
        return QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    return QdrantClient(url=QDRANT_URL)

def get_async_qdrant_client() -> AsyncQdrantClient:
    """Returns a configured AsyncQdrantClient."""
    if QDRANT_PATH:
        return AsyncQdrantClient(path=QDRANT_PATH)
    if QDRANT_API_KEY:
        return AsyncQdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    return AsyncQdrantClient(url=QDRANT_URL)

def init_collection():
    """Ensures the vector collection exists."""
    client = get_qdrant_client()
    
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

if __name__ == "__main__":
    init_collection()
