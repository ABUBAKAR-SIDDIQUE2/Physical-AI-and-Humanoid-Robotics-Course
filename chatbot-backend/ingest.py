import os
import re
import argparse
import asyncio
import time
from typing import List, Dict, Any
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types, errors
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
import tiktoken
from app.db.qdrant import get_qdrant_client, COLLECTION_NAME

# Load environment variables
load_dotenv()

# Configuration
DOCS_DIR = Path(__file__).parent.parent / "physical-ai-book" / "docs"
# COLLECTION_NAME defined in app.db.qdrant
EMBEDDING_MODEL = "text-embedding-004"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# Clients
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
qdrant_client = get_qdrant_client()

def clean_text(text: str) -> str:
    """Removes MDX frontmatter and normalizes whitespace."""
    # Remove frontmatter (between --- and ---)
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.DOTALL)
    
    # Remove imports and MDX specific tags if necessary (simple version)
    text = re.sub(r'import .*? from .*?;', '', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Chunks text into overlapping segments using tiktoken."""
    # Gemini uses a different tokenizer, but tiktoken (cl100k_base) is a decent approximation for chunking
    enc = tiktoken.get_encoding("cl100k_base") 
    tokens = enc.encode(text)
    
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        chunks.append(enc.decode(chunk_tokens))
        if end == len(tokens):
            break
        start += chunk_size - overlap
    return chunks

def get_embedding(text: str) -> List[float]:
    """Generates embeddings using Gemini with retry logic."""
    retries = 0
    max_retries = 10
    while retries < max_retries:
        try:
            response = gemini_client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=text
            )
            return response.embeddings[0].values
        except errors.ClientError as e:
            if e.code == 429:
                sleep_time = (2 ** retries) + 5
                print(f"Rate limited. Retrying in {sleep_time}s...")
                time.sleep(sleep_time)
                retries += 1
            else:
                raise e
    raise Exception("Max retries exceeded for embedding generation.")

def process_file(file_path: Path):
    """Reads, cleans, chunks, embeds, and upserts a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_text = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    # Metadata extraction
    chapter_slug = file_path.parent.name
    file_stem = file_path.stem
    source_file = str(file_path.relative_to(DOCS_DIR.parent))

    cleaned_text = clean_text(raw_text)
    chunks = chunk_text(cleaned_text)

    points = []
    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
            
        point_id_str = f"{chapter_slug}-{file_stem}-{i}"
        # Create deterministic UUID from string
        import uuid
        point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, point_id_str))

        embedding = get_embedding(chunk)
        time.sleep(5) # Rate limit politeness (15 RPM)
        
        payload = {
            "chapter_slug": chapter_slug,
            "source_file": source_file,
            "chunk_index": i,
            "text": chunk
        }

        points.append(qmodels.PointStruct(
            id=point_id,
            vector=embedding,
            payload=payload
        ))
        print(f"Prepared chunk {i} for {file_path.name}")

    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Upserted {len(points)} chunks for {file_path.name}")

def main():
    parser = argparse.ArgumentParser(description="Ingest documentation into Qdrant.")
    parser.add_argument("--reset", action="store_true", help="Recreate the collection.")
    args = parser.parse_args()

    if args.reset:
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=qmodels.VectorParams(size=768, distance=qmodels.Distance.COSINE),
        )
        print(f"Recreated collection '{COLLECTION_NAME}'.")

    # Recursive walk
    for file_path in DOCS_DIR.rglob("*"):
        if file_path.suffix in ['.md', '.mdx']:
            print(f"Processing {file_path}...")
            process_file(file_path)

if __name__ == "__main__":
    main()
