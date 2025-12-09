import os
from typing import List, Dict, Any, Optional
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

    async def generate_answer(self, query: str, context: List[Dict[str, Any]], user_profile: Optional[Dict[str, Any]] = None) -> str:
        context_str = "\n\n".join([f"Source: {c['source']}\n{c['text']}" for c in context])
        
        system_prompt = "You are a helpful assistant for the Physical AI & Humanoid Robotics Book."
        
        if user_profile:
            software = user_profile.get("software_bg", "Beginner")
            hardware = user_profile.get("hardware_bg", "None")
            
            system_prompt += f"\nThe user has the following background:\n- Software Experience: {software}\n- Hardware Experience: {hardware}\n"
            
            if software == "Expert":
                system_prompt += "Use technical jargon and show code snippets where appropriate.\n"
            elif software == "Beginner":
                system_prompt += "Explain coding concepts simply, using analogies if possible.\n"
                
            if hardware == "PCB Design" or hardware == "Arduino":
                system_prompt += "You can assume familiarity with basic electronics and hardware components.\n"
            elif hardware == "None":
                system_prompt += "Explain hardware concepts from first principles.\n"

        prompt = f"""{system_prompt}
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

    async def query(self, query: str, selected_text: str = None, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        context = await self.retrieve(query) # Still retrieve based on main query for now
        
        # We reuse the logic from generate_answer but apply it here if selected_text is present to avoid duplication complexity
        # or we just pass selected_text logic into generate_answer. For now, let's keep the logic aligned.
        
        context_str = "\n\n".join([f"Source: {c['source']}\n{c['text']}" for c in context])
        
        system_prompt = "You are a helpful assistant for the Physical AI & Humanoid Robotics Book."
        if user_profile:
            software = user_profile.get("software_bg", "Beginner")
            hardware = user_profile.get("hardware_bg", "None")
            system_prompt += f"\nThe user has the following background:\n- Software Experience: {software}\n- Hardware Experience: {hardware}\n"
            
            if software == "Expert":
                system_prompt += "Use technical jargon and show code snippets where appropriate.\n"
            elif software == "Beginner":
                system_prompt += "Explain coding concepts simply, using analogies if possible.\n"
        
        base_instruction = "Use the following context to answer the user's question."
        if selected_text:
            base_instruction = f"The user has highlighted the following text: \"{selected_text}\".\nFocus your answer on the highlighted text if possible, and use the following context to answer the user's question."

        prompt = f"""{system_prompt}
{base_instruction}
If the answer is not in the context, say so politely.

Context:
{context_str}

Question: {query}

Answer:"""

        response = await genai_client.aio.models.generate_content(
            model=GENERATION_MODEL,
            contents=prompt
        )
        answer = response.text
        
        return {
            "answer": answer,
            "citations": context
        }