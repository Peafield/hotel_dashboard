import { type ChangeEvent, useRef, useState } from "react";
import { ActionButton } from "../buttons/ActionButton";
import { LargeActionButton } from "../buttons/LargeActionButton";
import { Heading } from "../typography/Heading";
import { ImageInput } from "./ImageInput";
import { TextAreaInput } from "./TextAreaInput";
import { TextInput } from "./TextInput";
import type { RoomFormData } from "@/types";
import { DeleteIcon } from "../svgs/DeleteIcon";

export function RoomDetailsForm() {
  const [formData, setFormData] = useState<RoomFormData>({
    title: "",
    description: "",
    currentFacility: "",
    facilities: [],
    selectedFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddImageClick = () => {
    setFormData((prevState) => ({ ...prevState, selectedFile: null }));
    fileInputRef.current?.click();
  };

  const handleFacilityInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newText = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      facilities: prevState.facilities.map((item, i) =>
        i === index ? { ...item, text: newText } : item
      ),
    }));
  };

  const handleAddFacility = () => {
    const facilityTextToAdd = formData.currentFacility.trim();
    if (facilityTextToAdd) {
      const newFacility = {
        id: crypto.randomUUID(),
        text: facilityTextToAdd,
      };
      setFormData((prevState) => ({
        ...prevState,
        facilities: [...prevState.facilities, newFacility],
        currentFacility: "",
      }));
    }
  };

  const handleRemoveFacility = (indexToRemove: number) => {
    setFormData((prevState) => ({
      ...prevState,
      facilities: prevState.facilities.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // TODO: WIRE UP SUBMIT
  const handleSubmit = () => {
    setIsSubmitting(true);
  };
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
      <ImageInput
        id="ImageUpload"
        onChange={handleFileChange}
        selectedFile={formData.selectedFile}
        ref={fileInputRef}
      />
      {!formData.selectedFile && (
        <ActionButton
          title="ADD IMAGE"
          type="button"
          actionButtonType="add"
          onClick={handleAddImageClick}
          className="mb-8"
        />
      )}
      <Heading title="Facilties" />
      <TextInput
        label="Facility"
        id="currentFacility"
        name="currentFacility"
        placeholder="Facility detail"
        value={formData.currentFacility}
        required={true}
        onChange={handleInputChange}
      />
      {formData.facilities.map((facility, index) => (
        <div key={facility.id} className="flex items-center mb-2 gap-2">
          <TextInput
            label="Facility"
            id={facility.id}
            name={`facility-${index}`}
            value={facility.text}
            onChange={(e) => handleFacilityInputChange(index, e)}
            placeholder="Facility detail"
          />
          <button
            type="button"
            onClick={() => handleRemoveFacility(index)}
            className="p-1 cursor-pointer"
          >
            <DeleteIcon className="size-3" />
          </button>
        </div>
      ))}
      <ActionButton
        title="ADD FACILITY"
        type="button"
        actionButtonType="add"
        onClick={handleAddFacility}
      />
      <LargeActionButton
        title={isSubmitting ? "Submitting..." : "Create and generate pdf"}
        type="submit"
        className="mt-16"
        disabled={isSubmitting}
      />
    </form>
  );
}
