import { RoomData, RoomDataSchema } from "@/types";
import { z } from "zod";

const API_BASE_URL = "http://localhost:8000";

export async function fetchRooms(): Promise<RoomData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const validation = z.array(RoomDataSchema).safeParse(data);
    if (!validation.success) {
      console.error(
        "API Response Validation Error:",
        validation.error.flatten()
      );
      throw new Error("Invalid data format received from API.");
    }

    return validation.data;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
}

export async function createRoom(formData: FormData): Promise<RoomData> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } catch (e) {}
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log("🚀 ~ createRoom ~ data:", data);

    const validation = RoomDataSchema.safeParse(data);
    if (!validation.success) {
      console.error(
        "API Response Validation Error (Create):",
        validation.error.flatten()
      );
      throw new Error("Invalid data format received from API after create.");
    }

    return validation.data;
  } catch (error) {
    console.error("Failed to create room:", error);
    throw error;
  }
}
