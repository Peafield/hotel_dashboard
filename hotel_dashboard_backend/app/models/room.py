from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
import uuid


class Room(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    facilities: List[str]


class RoomCreate(BaseModel):
    name: str = Field(..., example="King Junior Suite")
    description: str = Field(
        ...,
        example=(
            "Modern luxury with kingsized bed, walk-in shower, double sinks, "
            "sitting area and air conditioning."
        ),
    )
    facilities: List[str] = Field(
        ..., example=["King sized bed", "Air Conditioning", "Sitting area"]
    )


class RoomUpdate(BaseModel):
    name: Optional[str] = Field(None, example="King Junior Suite Updated")
    description: Optional[str] = Field(None, example="An updated description...")
    facilities: Optional[List[str]] = Field(
        None,
        example=[
            "King sized bed",
            "Air Conditioning",
            "Sitting area",
            "Wifi",
        ],
    )
    model_config = ConfigDict(extra="fobid")
