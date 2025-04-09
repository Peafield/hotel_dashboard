import { z } from "zod";
import { AddIcon } from "./components/svgs/AddIcon";
import { ReturnIcon } from "./components/svgs/ReturnIcon";
import { DeleteIcon } from "./components/svgs/DeleteIcon";

export type IconProps = {
  className?: string;
};

export const RoomDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  facilities: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string().optional(),
  image_filename: z.string().optional(),
});

export type RoomData = z.infer<typeof RoomDataSchema>;

export type DashBoardViewState = "RoomList" | "Create" | "Edit";
export type PageTitles = "All rooms" | "Room details";

export const viewTitleMap: Record<DashBoardViewState, PageTitles> = {
  RoomList: "All rooms",
  Create: "Room details",
  Edit: "Room details",
};

export type ActionButtonTypes = "return" | "add" | "delete";

export const actionIconMap: Record<
  ActionButtonTypes,
  React.ComponentType<IconProps>
> = {
  add: AddIcon,
  return: ReturnIcon,
  delete: DeleteIcon,
};

export const RoomFormDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  currentFacility: z.string(),
  facilities: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  selectedFile: z
    .instanceof(File, { message: "Image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, {
      message: "Max image size is 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type), {
      message: "Only .jpeg, .png, and .webp, formats are accepted.",
    })
    .nullable(),
});

export type RoomFormData = z.infer<typeof RoomFormDataSchema>;
