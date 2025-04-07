import os
from fastapi import UploadFile
import aiofiles

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_upload_file(upload_file: UploadFile, filename: str) -> str:
    """Asynchronously saves an uploaded file to a predefined directory."""
    save_path = os.path.join(UPLOAD_DIR, filename)
    print(f"[File Handler] Async saving uploaded file to: {save_path}")
    try:
        async with aiofiles.open(save_path, "wb") as buffer:
            content = await upload_file.read()
            await buffer.write(content)
    except Exception as e:
        print(f"[File Handler] Error async saving file {filename}: {e}")
        raise
    finally:
        await upload_file.close()
    return save_path
