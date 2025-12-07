import asyncio
import os
import sys
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    db_url = os.getenv("NEON_CONN_STRING")
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
        
    engine = create_async_engine(db_url, echo=False)
    
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public';"))
        tables = result.fetchall()
        print("Tables in DB:", tables)
        
        # Check alembic version
        try:
            version = await conn.execute(text("SELECT * FROM alembic_version;"))
            print("Alembic Version:", version.fetchall())
        except Exception as e:
            print("Alembic version table not found or error:", e)

if __name__ == "__main__":
    asyncio.run(main())
