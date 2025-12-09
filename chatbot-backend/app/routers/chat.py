from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.rag_engine import RagEngine
from app.db.postgres import get_db
from app.models import ChatSession, ChatMessage
from app.routers.auth_middleware import get_current_user

router = APIRouter()
rag_engine = RagEngine()

class QueryRequest(BaseModel):
    query: str
    selected_text: Optional[str] = None
    session_id: Optional[UUID] = None

class Citation(BaseModel):
    text: str
    source: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    session_id: UUID

@router.post("/query", response_model=QueryResponse)
async def chat_query(
    request: QueryRequest,
    db: AsyncSession = Depends(get_db),
    user_profile: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    try:
        session_id = request.session_id
        chat_session: ChatSession = None

        if session_id:
            chat_session = await db.get(ChatSession, session_id)
            if not chat_session:
                raise HTTPException(status_code=404, detail="Chat session not found.")
        else:
            chat_session = ChatSession()
            db.add(chat_session)
            await db.flush()
            session_id = chat_session.id

        # Save user message
        user_message = ChatMessage(
            session_id=session_id,
            role="user",
            content=request.query
        )
        db.add(user_message)

        # Call RAG engine with user profile
        rag_response = await rag_engine.query(
            request.query, 
            request.selected_text,
            user_profile=user_profile
        )
        
        # Save AI response
        ai_message = ChatMessage(
            session_id=session_id,
            role="ai",
            content=rag_response["answer"]
        )
        db.add(ai_message)

        await db.commit()
        await db.refresh(chat_session)

        return {
            "answer": rag_response["answer"],
            "citations": rag_response["citations"],
            "session_id": session_id
        }
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")