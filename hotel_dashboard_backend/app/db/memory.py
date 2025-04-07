from typing import Dict, List, Optional
import uuid
from app.models.room import Room, RoomUpdate

# In-memory storage for the take-home-test.
# In a real world example I would use a proper DB (Mongodb etc.)
db: Dict[uuid.UUID, Room] = {}


def get_all_rooms() -> List[Room]:
    """Retrieves all rooms from the in-memory database"""
    return list(db.values())


def save_room(room: Room):
    """Saves a room object into the in-memory database"""
    if room.id in db:
        print(f"Warning: Room ID {room.id} already exists. Overwriting...")
    db[room.id] = room
    print(f"Room '{room.name}' (ID: {room.id}) saved.")


def get_room_by_id(room_id: uuid.UUID) -> Optional[Room]:
    """Retrieves a single room from the database by its UUID.

    Args:
        room_id: The UUID of the room to retrieve.

    Returns:
        The Room object if found, otherwise None
    """
    return db.get(room_id)


def update_room(room_id: uuid.UUID, room_update: RoomUpdate) -> Optional[Room]:
    """Updates an existing room in the database with provided data.

    Args:
        room_id: The UUID of the room to update.
        room_update: A RoomUpdate model instance containing the fields to
        update.

    Returns:
        The updated Room object if found and updated, otherwise None.
    """
    existing_room = get_room_by_id(room_id)
    if existing_room is None:
        return None

    update_data = room_update.model_dump(exclude_unset=True)

    # If no data was add in update_data, just return the existing room.
    if not update_data:
        return existing_room

    updated_room = existing_room.model_copy(update=update_data)

    save_room(updated_room)
    return updated_room


def delete_room_by_id(room_id: uuid.UUID) -> Optional[Room]:
    """Deletes a room from the database by its UUID.

    Args:
        room_id: The UUID of the room to delete.

    Returns:
        The deleted Room object if found and deleted, otherwise None.
    """
    return db.pop(room_id, None)
