from fastapi import FastAPI
from app.routers import rooms
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="Hotel Dashboard API",
    description="API for managing hotel room details",
    version="0.1.0",
)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)

UPLOAD_DIR_NAME = "uploaded_images"
app.mount(
    f"/{UPLOAD_DIR_NAME}", StaticFiles(directory=UPLOAD_DIR_NAME), name=UPLOAD_DIR_NAME
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Hotel Dashboard API!"}
