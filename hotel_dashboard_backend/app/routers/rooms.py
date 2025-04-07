from fastapi import APIRouter, HTTPException, Response, status
from typing import List
from app.models.room import Room, RoomCreate, RoomUpdate
from app.db.memory import (
    delete_room_by_id,
    get_all_rooms,
    get_room_by_id,
    save_room,
    update_room,
)
import uuid


# from app.db.memory import db

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
async def create_room(room_data: RoomCreate):
    """Create a new hotel room.
    - Takes room details (name, description, facilities) in the request body.
    - Generates a unqiue ID automatically.
    - Returns the newly create room object, including its ID.
    """
    new_id = uuid.uuid4()
    new_room = Room(id=new_id, **room_data.model_dump())
    save_room(new_room)
    return new_room


@router.get("/{room.id}", response_model=Room)
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
async def patch_room(room_id: uuid.UUID, room_update: RoomUpdate):
    """
    Update details of a specific hotel room.
    Only provide the fields you want to change in the request body.
    """
    updated_room = update_room(room_id, room_update)
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
    deleted_room = delete_room_by_id(room_id)
    if deleted_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
