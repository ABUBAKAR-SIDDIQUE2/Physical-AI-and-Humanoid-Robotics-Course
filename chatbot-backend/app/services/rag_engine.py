import os
from typing import List, Dict, Any
from google import genai
from app.services.embeddings import get_embedding
from app.db.qdrant import get_async_qdrant_client, COLLECTION_NAME
from dotenv import load_dotenv

load_dotenv()

# Gemini Client for generation
genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
GENERATION_MODEL = "gemini-2.5-flash-lite"

class RagEngine:
    def __init__(self):
        self.qdrant = get_async_qdrant_client()
        
    async def retrieve(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        query_vector = await get_embedding(query)
        
        search_result = await self.qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=limit
        )
        
        return [
            {
                "text": hit.payload.get("text"),
                "source": hit.payload.get("source_file"),
                "score": hit.score
            }
            for hit in search_result
        ]

    async def generate_answer(self, query: str, context: List[Dict[str, Any]]) -> str:
        context_str = "\n\n".join([f"Source: {c['source']}\n{c['text']}" for c in context])
        
        prompt = f"""You are a helpful assistant for the Physical AI & Humanoid Robotics Book.
Use the following context to answer the user's question.
If the answer is not in the context, say so politely.

Context:
{context_str}

Question: {query}

Answer:"""

        response = await genai_client.aio.models.generate_content(
            model=GENERATION_MODEL,
            contents=prompt
        )
        
        return response.text

    async def query(self, query: str, selected_text: str = None) -> Dict[str, Any]:
        context = await self.retrieve(query) # Still retrieve based on main query for now
        
        if selected_text:
            # Modify prompt to include selected_text
            context_str = "\n\n".join([f"Source: {c['source']}\n{c['text']}" for c in context])
            
            prompt = f"""You are a helpful assistant for the Physical AI & Humanoid Robotics Book.
The user has highlighted the following text: "{selected_text}".
Focus your answer on the highlighted text if possible, and use the following context to answer the user's question.
If the answer is not in the context, say so politely.

Context:
{context_str}

Question: {query}

Answer:"""
            # Re-call generate_content directly if selected_text is provided to use the modified prompt
            answer_response = await genai_client.aio.models.generate_content(
                model=GENERATION_MODEL,
                contents=prompt
            )
            answer = answer_response.text
        else:
            answer = await self.generate_answer(query, context)
        
        return {
            "answer": answer,
            "citations": context
        }
