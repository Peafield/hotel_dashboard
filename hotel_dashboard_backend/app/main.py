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

# For the test I'm mounting the directories to act as an asset bucket but in
# production we would use something like cloudflare or AWS to host the images.
UPLOAD_DIR_NAME = "uploaded_images"
PDF_DIR_NAME = "generated_pdfs"

os.makedirs(UPLOAD_DIR_NAME, exist_ok=True)
os.makedirs(PDF_DIR_NAME, exist_ok=True)

app.mount(
    f"/{UPLOAD_DIR_NAME}", StaticFiles(directory=UPLOAD_DIR_NAME), name=UPLOAD_DIR_NAME
)
app.mount(f"/{PDF_DIR_NAME}", StaticFiles(directory=PDF_DIR_NAME), name=PDF_DIR_NAME)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Hotel Dashboard API!"}
