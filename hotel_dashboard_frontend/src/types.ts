import { z } from "zod";

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
