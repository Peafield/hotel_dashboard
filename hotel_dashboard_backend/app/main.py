from fastapi import FastAPI
from app.routers import rooms

app = FastAPI(
    title="Hotel Dashboard API",
    description="API for managing hotel room details",
    version="0.1.0",
)

app.include_router(rooms.router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Hotel Dashboard API!"}
