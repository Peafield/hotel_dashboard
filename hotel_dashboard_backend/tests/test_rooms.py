import io
import json
import os
import pytest
import uuid
from fastapi.testclient import TestClient
from fastapi import status
from app.main import app
from app.db.memory import db
from app.utils.file_handler import UPLOAD_DIR
from app.utils.pdf_generator import PDF_OUTPUT_DIR
import time

client = TestClient(app)

sample_room_payload = {
    "name": "Standard Queen",
    "description": "A cozy room with a queen-sized bed.",
    "facilities": ["Wifi", "TV", "Bathroom"],
}


@pytest.fixture(scope="function")
def created_room_fixture():
    """
    Fixture to create a room (inc. PDF), yield its data, and clean up DB & PDF.
    """
    db.clear()
    pdf_file_path = None
    if os.path.exists(PDF_OUTPUT_DIR):
        for item in os.listdir(PDF_OUTPUT_DIR):
            if item.endswith(".pdf"):
                os.remove(os.path.join(PDF_OUTPUT_DIR, item))

    print("\n[Fixture] Creating room via form data (will trigger PDF gen)...")
    facilities_json_str = json.dumps(sample_room_payload["facilities"])
    form_data = {
        "name": sample_room_payload["name"],
        "description": sample_room_payload["description"],
        "facilities_json": facilities_json_str,
    }
    response = client.post("/rooms", data=form_data)
    assert response.status_code == status.HTTP_201_CREATED
    created_room_data = response.json()
    assert "id" in created_room_data
    created_room_id = created_room_data["id"]
    pdf_file_path = os.path.join(PDF_OUTPUT_DIR, f"room_{created_room_id}.pdf")

    yield created_room_data

    # --- Teardown ---
    print("[Fixture] Clearing database...")
    db.clear()
    print(f"[Fixture] Cleaning up PDF: {pdf_file_path}")
    if pdf_file_path and os.path.exists(pdf_file_path):
        os.remove(pdf_file_path)


def test_list_rooms_initially_empty():
    """
    Test GET /rooms when the database is initially empty.
    It should return a 200 OK status and an empty list.
    """
    db.clear()
    response = client.get("/rooms")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_create_room():
    """Test POST /rooms using form data."""
    db.clear()

    facilities_json_str = json.dumps(sample_room_payload["facilities"])
    form_data = {
        "name": sample_room_payload["name"],
        "description": sample_room_payload["description"],
        "facilities_json": facilities_json_str,
    }

    response = client.post("/rooms", data=form_data)  # Use data=

    assert response.status_code == status.HTTP_201_CREATED
    response_data = response.json()
    assert response_data["name"] == sample_room_payload["name"]
    assert response_data["description"] == sample_room_payload["description"]
    assert response_data["facilities"] == sample_room_payload["facilities"]
    assert "id" in response_data
    try:
        room_id = uuid.UUID(response_data["id"], version=4)
    except ValueError:
        assert False, f"ID '{response_data['id']}' is not a valid UUID4"
    assert room_id in db
    db_room = db[room_id]
    assert db_room.name == sample_room_payload["name"]
    assert db_room.description == sample_room_payload["description"]
    assert db_room.facilities == sample_room_payload["facilities"]
    assert db_room.id == room_id


def test_create_room_with_image():
    """
    Test POST /rooms successfully creates a room with an image upload.
    Verifies file is saved and filename is stored.
    """
    db.clear()
    facilities_json_str = json.dumps(sample_room_payload["facilities"])
    form_data = {
        "name": "Image Room Test",
        "description": "Testing upload",
        "facilities_json": facilities_json_str,
    }
    file_content = b"<dummy image content>"
    file_name = "test_upload.png"
    files_data = {
        "image": (
            file_name,
            io.BytesIO(file_content),
            "image/png",
        )
    }

    saved_file_path = None

    try:
        response = client.post("/rooms", data=form_data, files=files_data)

        assert response.status_code == status.HTTP_201_CREATED
        response_data = response.json()
        assert response_data["name"] == form_data["name"]
        assert response_data["description"] == form_data["description"]
        assert response_data["facilities"] == sample_room_payload["facilities"]

        assert "image_filename" in response_data
        saved_filename = response_data["image_filename"]
        assert saved_filename is not None
        assert saved_filename.endswith(f"_{file_name}")

        room_id = uuid.UUID(response_data["id"])
        assert room_id in db
        db_room = db[room_id]
        assert db_room.image_filename == saved_filename

        saved_file_path = os.path.join(UPLOAD_DIR, saved_filename)
        assert os.path.exists(
            saved_file_path
        ), f"File was not saved to {saved_file_path}"

        with open(saved_file_path, "rb") as f:
            assert f.read() == file_content

    finally:
        if saved_file_path and os.path.exists(saved_file_path):
            print(f"\n[Cleanup] Removing test file: {saved_file_path}")
            os.remove(saved_file_path)
        db.clear()


def test_list_rooms_after_creation(created_room_fixture):
    """Test GET /rooms after a room has been created."""
    created_room_data = created_room_fixture

    list_response = client.get("/rooms")

    assert list_response.status_code == status.HTTP_200_OK
    list_data = list_response.json()
    assert len(list_data) == 1
    assert list_data[0]["id"] == created_room_data["id"]
    assert list_data[0]["name"] == created_room_data["name"]
    assert list_data[0]["description"] == created_room_data["description"]
    assert list_data[0]["facilities"] == created_room_data["facilities"]


def test_get_specific_room_success(created_room_fixture):
    """Test GET /rooms/{room_id} for an existing room."""
    created_room_id = created_room_fixture["id"]

    get_response = client.get(f"/rooms/{created_room_id}")

    assert get_response.status_code == status.HTTP_200_OK
    get_data = get_response.json()
    assert get_data["id"] == created_room_id
    assert get_data["name"] == sample_room_payload["name"]
    assert get_data["description"] == sample_room_payload["description"]
    assert get_data["facilities"] == sample_room_payload["facilities"]


def test_get_specific_room_not_found():
    """Test GET /rooms/{room_id} for a non-existent room ID."""
    non_existent_id = uuid.uuid4()

    response = client.get(f"/rooms/{non_existent_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Room not found"


def test_patch_room_success(created_room_fixture):
    """Test PATCH /rooms/{room_id} using form data."""
    created_room_id = created_room_fixture["id"]

    update_payload = {
        "name": "Updated Queen Name",
        "facilities": ["Wifi", "TV", "Bathroom", "Mini-fridge"],
    }

    facilities_update_json = json.dumps(update_payload["facilities"])
    patch_data = {
        "name": update_payload["name"],
        "facilities_json": facilities_update_json,
    }

    patch_response = client.patch(f"/rooms/{created_room_id}", data=patch_data)

    assert patch_response.status_code == status.HTTP_200_OK
    response_data = patch_response.json()
    assert response_data["id"] == created_room_id
    assert response_data["name"] == update_payload["name"]
    assert response_data["description"] == sample_room_payload["description"]
    assert response_data["facilities"] == update_payload["facilities"]

    db_room = db[uuid.UUID(created_room_id)]
    assert db_room.name == update_payload["name"]
    assert db_room.description == sample_room_payload["description"]
    assert db_room.facilities == update_payload["facilities"]


def test_patch_room_not_found():
    """Test PATCH /rooms/{room_id} for non-existent room using form data."""
    db.clear()
    non_existent_id = uuid.uuid4()
    update_data = {"name": "Trying to update nothing"}

    response = client.patch(f"/rooms/{non_existent_id}", data=update_data)

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Room not found"


def test_delete_room_success(created_room_fixture):
    """Test DELETE /rooms/{room_id} for an existing room."""

    created_room_id_str = created_room_fixture["id"]

    created_room_id = uuid.UUID(created_room_id_str)
    assert created_room_id in db
    delete_response = client.delete(f"/rooms/{created_room_id_str}")
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT
    assert delete_response.content == b""
    assert created_room_id not in db


def test_delete_room_not_found():
    """Test DELETE /rooms/{room_id} for a non-existent room ID."""
    db.clear()

    non_existent_id = uuid.uuid4()
    response = client.delete(f"/rooms/{non_existent_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Room not found"


def test_download_pdf_success(created_room_fixture):
    """
    Test GET /rooms/{room_id}/pdf successfully downloads the PDF.
    Relies on the fixture having created the room and triggered PDF generation.
    """
    created_room_data = created_room_fixture
    room_id = created_room_data["id"]
    expected_pdf_path = os.path.join(PDF_OUTPUT_DIR, f"room_{room_id}.pdf")

    # Small wait to test pdf existence.
    max_wait = 5
    start_time = time.time()
    while not os.path.exists(expected_pdf_path) and time.time() - start_time < max_wait:
        time.sleep(0.1)
    assert os.path.exists(expected_pdf_path), "PDF file was not generated by fixture"

    response = client.get(f"/rooms/{room_id}/pdf")

    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-type"] == "application/pdf"
    assert "content-disposition" in response.headers
    assert f'filename="room_{room_id}.pdf"' in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")


def test_download_pdf_not_found():
    """
    Test GET /rooms/{room_id}/pdf returns 404 for a non-existent PDF/room.
    """
    db.clear()
    non_existent_id = uuid.uuid4()
    expected_pdf_path = os.path.join(PDF_OUTPUT_DIR, f"room_{non_existent_id}.pdf")
    if os.path.exists(expected_pdf_path):
        os.remove(expected_pdf_path)

    response = client.get(f"/rooms/{non_existent_id}/pdf")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    response_data = response.json()
    assert "detail" in response_data
    assert response_data["detail"] == "Room not found"
