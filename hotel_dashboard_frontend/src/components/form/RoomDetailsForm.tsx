import { useDashboardState } from "@/store/useDashboardStore";
import type { RoomData, RoomFormData } from "@/types";
import { type ChangeEvent, useRef, useState } from "react";
import { ActionButton } from "../buttons/ActionButton";
import { LargeActionButton } from "../buttons/LargeActionButton";
import { DeleteIcon } from "../svgs/DeleteIcon";
import { Heading } from "../typography/Heading";
import { ImageInput } from "./ImageInput";
import { TextAreaInput } from "./TextAreaInput";
import { TextInput } from "./TextInput";

type RoomDetailsFormProps = {
	roomData?: RoomData;
};

export function RoomDetailsForm({ roomData }: RoomDetailsFormProps) {
	const { dashboardViewState } = useDashboardState();
	const [formData, setFormData] = useState<RoomFormData>(() => {
		if (dashboardViewState === "Edit" && roomData) {
			// EDIT MODE
			return {
				name: roomData.name,
				description: roomData.description,
				currentFacility: "",
				facilities: roomData.facilities.map((facilityText) => ({
					id: crypto.randomUUID(),
					text: facilityText,
				})),
				selectedFile: null,
			};
		}
		// CREATE MODE
		return {
			name: "",
			description: "",
			currentFacility: "",
			facilities: [],
			selectedFile: null,
		};
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const newText = event.target.value;
		setFormData((prevState) => ({
			...prevState,
			facilities: prevState.facilities.map((item, i) =>
				i === index ? { ...item, text: newText } : item,
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
				(_, index) => index !== indexToRemove,
			),
		}));
	};

	const handleDeleteRoom = () => {
		// TODO: call delete room
		// Delete from state on success
	};

	// TODO: WIRE UP SUBMIT
	const handleSubmit = () => {
		setIsSubmitting(true);
	};
	return (
		<form className="w-[630px]" onSubmit={handleSubmit}>
			<header className="w-full flex items-center justify-between">
				<Heading title="Room details" />
				{dashboardViewState === "Edit" && (
					<ActionButton
						title="DELETE ROOM"
						type="button"
						actionButtonType="delete"
						onClick={handleDeleteRoom}
						className="mb-8"
					/>
				)}
			</header>
			<TextInput
				label="Title"
				id="roomName"
				name="name"
				placeholder="Room title"
				value={formData.name}
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
				mode={dashboardViewState}
				src={roomData?.image_filename}
				onChange={handleFileChange}
				selectedFile={formData.selectedFile}
				ref={fileInputRef}
			/>
			{!formData.selectedFile ||
				(!roomData?.image_filename && (
					<ActionButton
						title="ADD IMAGE"
						type="button"
						actionButtonType="add"
						onClick={handleAddImageClick}
						className="mb-8"
					/>
				))}
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
				title={
					isSubmitting
						? "Submitting..."
						: dashboardViewState === "Create"
							? "Create and generate pdf"
							: "Save and Generate pdf"
				}
				type="submit"
				className="mt-12"
				disabled={isSubmitting}
			/>
		</form>
	);
}
