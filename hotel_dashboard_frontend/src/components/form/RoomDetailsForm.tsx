import { type ChangeEvent, useState } from "react";
import { ActionButton } from "../buttons/ActionButton";
import { LargeActionButton } from "../buttons/LargeActionButton";
import { Heading } from "../typography/Heading";
import { ImageInput } from "./ImageInput";
import { TextAreaInput } from "./TextAreaInput";
import { TextInput } from "./TextInput";
import type { RoomFormData } from "@/types";

export function RoomDetailsForm() {
  const [formData, setFormData] = useState<RoomFormData>({
    title: "",
    description: "",
    currentFacility: "",
    facilities: [] as string[],
    selectedFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prevState) => ({
      ...prevState,
      selectedFile: file,
    }));
  };

  const handleAddFacility = () => {
    const facilityToAdd = formData.currentFacility.trim();
    if (facilityToAdd) {
      setFormData((prevState) => ({
        ...prevState,
        facilities: [...prevState.facilities, facilityToAdd],
        currentFacility: "",
      }));
    }
  };

  const handleSubmit = () => {};
  return (
    <form className="w-[630px]" onSubmit={handleSubmit}>
      <Heading title="Room details" />
      <TextInput
        label="Title"
        id="roomTitle"
        name="title"
        placeholder="Room title"
        value={formData.title}
        required={true}
        onChange={handleInputChange}
      />
      <TextAreaInput
        label="Description"
        id="roomDescription"
        name="description"
        placeholder="Room description..."
        value={formData.description}
        required={true}
        onChange={handleInputChange}
      />
      <ImageInput id="ImageUpload" onChange={handleFileChange} />
      <ActionButton
        title="ADD IMAGE"
        type="button"
        actionButtonType="add"
        className="mb-8"
      />
      <Heading title="Facilties" />
      <TextInput
        label="Facility"
        id="currentFacility"
        name="currentFacility"
        placeholder="Facility detail"
        value={formData.currentFacility}
        required={true}
        onChange={handleAddFacility}
      />
      {/* TODO: display add facitilies */}
      <ActionButton
        title="ADD FACILITY"
        type="button"
        actionButtonType="add"
        onClick={handleAddFacility}
      />
      <LargeActionButton
        title="create and generate PDF"
        type="submit"
        className="mt-16"
        disabled={isSubmitting}
      />
    </form>
  );
}
