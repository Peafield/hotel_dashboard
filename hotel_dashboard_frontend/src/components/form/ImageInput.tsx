import type { DashBoardViewState } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";

type ImageInputProps = {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  mode: DashBoardViewState;
  src?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
};

export function ImageInput({
  id,
  onChange,
  selectedFile,
  mode,
  src,
  required = false,
  ref,
  className,
}: ImageInputProps) {
  let imageUrl = "";
  if (src && mode === "Edit") {
    imageUrl = `http://localhost:8000/uploaded_images/${src}`;
  }

  if (selectedFile) {
    imageUrl = URL.createObjectURL(selectedFile);
  }

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <fieldset>
      <label
        htmlFor={id}
        className={clsx(
          "block Image-xs font-medium text-hugo-dark-gray font-sans mb-4",
          className
        )}
      >
        Image
      </label>
      {imageUrl && (
        <div className="relative w-full max-w-56 aspect-video mb-8">
          <Image src={imageUrl} alt="Preview" fill className="object-contain" />
        </div>
      )}
      <input
        type="file"
        id={id}
        onChange={onChange}
        required={required}
        className="hidden"
        disabled={!!imageUrl}
        accept="image/png, image/jpeg, image/webp"
        ref={ref}
      />
    </fieldset>
  );
}
