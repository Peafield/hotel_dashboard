import { createRoom, updateRoom } from "@/lib/apiClient";
import { useDashboardState } from "@/store/useDashboardStore";
import type { RoomData, RoomFormData } from "@/types";
import { useState } from "react";

interface UseRoomFormSubmitOptions {
  isEditing: boolean;
  roomData?: RoomData;
  onSubmitSuccess: () => void;
}

export function useRoomFormSubmit({
  isEditing,
  roomData,
  onSubmitSuccess,
}: UseRoomFormSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { add: addRoomToGlobalState, update: updateRoomInGlobalState } =
    useDashboardState.getState();
  const submitHandler = async (formData: RoomFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);
    apiFormData.append("description", formData.description);
    const facilityTexts = formData.facilities.map((item) => item.text);
    apiFormData.append("facilities_json", JSON.stringify(facilityTexts));
    if (formData.selectedFile) {
      apiFormData.append(
        "image",
        formData.selectedFile,
        formData.selectedFile.name
      );
    }

    try {
      let savedRoom: RoomData;
      if (isEditing && roomData) {
        savedRoom = await updateRoom(roomData.id, apiFormData);
        updateRoomInGlobalState(savedRoom);
      } else {
        savedRoom = await createRoom(apiFormData);
        addRoomToGlobalState(savedRoom);
      }

      onSubmitSuccess();
    } catch (error) {
      console.error("Form submission error in hook:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Submission failed";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { submitHandler, isSubmitting, submitError };
}
