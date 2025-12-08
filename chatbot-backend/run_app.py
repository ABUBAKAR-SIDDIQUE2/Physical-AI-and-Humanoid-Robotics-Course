import asyncio
import sys
import os
import uvicorn

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
