import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()

NEON_CONN_STRING = os.getenv("NEON_CONN_STRING")

if not NEON_CONN_STRING:
    raise ValueError("NEON_CONN_STRING environment variable is not set")

# Modify connection string to use psycopg driver
if NEON_CONN_STRING.startswith("postgresql://"):
    NEON_CONN_STRING = NEON_CONN_STRING.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_async_engine(NEON_CONN_STRING, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
