from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.postgres import get_db
from app.models import ChatSession, ChatMessage
from pydantic import BaseModel
import datetime

router = APIRouter()

class MessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True


@router.get("/session/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ChatSession).where(ChatSession.id == session_id).options(
        selectinload(ChatSession.messages)
    )
    result = await db.execute(stmt)
    chat_session = result.scalar_one_or_none()

    if not chat_session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    
    return SessionResponse.from_orm(chat_session)
