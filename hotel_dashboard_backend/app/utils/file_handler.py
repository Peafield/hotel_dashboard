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


def delete_file_if_exists(file_path: str):
    """Safely attempts to delete a file if it exists."""
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Successfully deleted file: {file_path}")
            return True
        except OSError as e:
            print(f"Error deleting file {file_path}: {e}")
            return False
    elif file_path:
        print(f"File not found for deletion, skipping: {file_path}")
        return False
    return True
