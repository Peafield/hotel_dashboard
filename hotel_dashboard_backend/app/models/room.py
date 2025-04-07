from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


class Room(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    facilities: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image_filename: Optional[str] = None


class RoomCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"examples": ["Deluxe Double"]})
    description: str = Field(
        ...,
        json_schema_extra={"examples": ["A comfortable room with a queen-sized bed."]},
    )
    facilities: List[str] = Field(
        ..., json_schema_extra={"examples": [["Wifi", "Air Conditioning", "TV"]]}
    )
    model_config = ConfigDict(extra="forbid")


class RoomUpdate(BaseModel):
    name: Optional[str] = Field(
        None, json_schema_extra={"examples": ["Deluxe Double Updated"]}
    )
    description: Optional[str] = Field(
        None, json_schema_extra={"examples": ["An updated description."]}
    )
    facilities: Optional[List[str]] = Field(
        None, json_schema_extra={"examples": [["Wifi", "Air Conditioning", "Mini-bar"]]}
    )

    model_config = ConfigDict(extra="forbid")
