import os
from typing import Annotated, Dict, Optional
from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile, status
from typing import List

from fastapi.responses import FileResponse
from app.models.room import Room, RoomUpdate
from app.db.memory import (
    delete_room_by_id,
    get_all_rooms,
    get_room_by_id,
    save_room,
    update_room,
)
import uuid
from app.utils.file_handler import UPLOAD_DIR, delete_file_if_exists, save_upload_file
import json

from app.utils.pdf_generator import PDF_OUTPUT_DIR

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.get("/ping", tags=["Rooms"])
async def ping_rooms():
    return {"message": "Rooms router is active!"}


@router.get("/", response_model=List[Room])
async def list_rooms():
    """Retrieve a list of all hotel rooms"""
    all_rooms = get_all_rooms()
    return all_rooms


@router.post("/", response_model=Room, status_code=status.HTTP_201_CREATED)
async def create_room_with_upload(
    name: Annotated[str, Form(...)],
    description: Annotated[str, Form(...)],
    facilities_json: Annotated[str, Form(...)],
    image: Annotated[Optional[UploadFile], File()] = None,
):
    image_filename: Optional[str] = None
    if image and image.filename:
        unique_filename = f"{uuid.uuid4()}_{image.filename}"
        try:
            saved_path = await save_upload_file(image, unique_filename)
            image_filename = unique_filename
            print(f"Image processed by utility: {saved_path}")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not save image: {e}",
            )
    try:
        facilities_list = json.loads(facilities_json)
        if not isinstance(facilities_list, list):
            raise ValueError("facilities_json did not decode to a list")
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid format for facilities_json: {e}",
        )

    new_id = uuid.uuid4()
    new_room = Room(
        id=new_id,
        name=name,
        description=description,
        facilities=facilities_list,
        image_filename=image_filename,
    )
    save_room(new_room)
    return new_room


@router.get("/{room_id}", response_model=Room)
async def read_room(room_id: uuid.UUID):
    """Retrieves details of a specific hotel room by its unique ID.

    - **room_id**: The UUID of the room to retrieve.
    """
    room = get_room_by_id(room_id)
    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return room


@router.patch("/{room_id}", response_model=Room)
async def patch_room_with_upload(
    room_id: uuid.UUID,
    name: Annotated[Optional[str], Form()] = None,
    description: Annotated[Optional[str], Form()] = None,
    facilities_json: Annotated[Optional[str], Form()] = None,
    image: Annotated[Optional[UploadFile], File()] = None,
):
    update_payload_dict: Dict[str, any] = {}
    image_filename: Optional[str] = None

    if image and image.filename:
        unique_filename = f"{uuid.uuid4()}_{image.filename}"
        try:
            saved_path = await save_upload_file(image, unique_filename)
            image_filename = unique_filename
            print(f"Image updated via utility: {saved_path}")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not save updated image: {e}",
            )
        update_payload_dict["image_filename"] = image_filename

    if name is not None:
        update_payload_dict["name"] = name
    if description is not None:
        update_payload_dict["description"] = description
    if facilities_json is not None:
        try:
            facilities_list = json.loads(facilities_json)
            if not isinstance(facilities_list, list):
                raise ValueError("facilities_json did not decode to a list")
            update_payload_dict["facilities"] = facilities_list
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid format for facilities_json: {e}",
            )

    # If the updata_payload is empty, do nothing.
    if not update_payload_dict:
        pass

    try:
        room_update_model = RoomUpdate(**update_payload_dict)
    except Exception as pydantic_error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error in update data: {pydantic_error}",
        )

    updated_room = update_room(room_id, room_update_model)

    if updated_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )

    return updated_room


@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_room(room_id: uuid.UUID):
    """
    Delete a specific hotel room by its unique ID.
    Returns HTTP 204 No Content on successful deletion.
    """
    room_to_delete: Room | None = get_room_by_id(room_id)

    if room_to_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )

    image_deleted = True
    pdf_deleted = True

    image_path_to_delete = None
    if hasattr(room_to_delete, "image_filename") and room_to_delete.image_filename:
        image_path_to_delete = os.path.join(UPLOAD_DIR, room_to_delete.image_filename)

    pdf_path_to_delete = None
    if hasattr(room_to_delete, "id") and room_to_delete.id:
        pdf_path_to_delete = os.path.join(
            PDF_OUTPUT_DIR, f"room_{room_to_delete.id}.pdf"
        )

    if image_path_to_delete:
        image_deleted = delete_file_if_exists(image_path_to_delete)

    if pdf_path_to_delete:
        pdf_deleted = delete_file_if_exists(pdf_path_to_delete)

    if not image_deleted or not pdf_deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete associated files. Database record not deleted.",
        )

    deleted_room = delete_room_by_id(room_id)
    if deleted_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{room_id}/pdf",
    response_class=FileResponse,
    responses={
        200: {
            "description": "PDF file for the specified room.",
            "content": {"application/pdf": {}},
        },
        404: {"description": "Room or PDF not found"},
    },
)
async def download_room_pdf(room_id: uuid.UUID):
    """
    Downloads the generated PDF file for a specific room.
    Returns the PDF file if found, otherwise returns a 404 error.
    """
    pdf_filename = f"room_{room_id}.pdf"
    file_path = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

    if not os.path.exists(file_path):
        room = get_room_by_id(room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PDF not found for room {room_id}. Generate it by saving the room details.",
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=pdf_filename,
    )
