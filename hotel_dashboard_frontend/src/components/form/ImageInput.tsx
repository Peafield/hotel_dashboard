import type { DashBoardViewState } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(objectUrl);
    } else if (src && mode === "Edit") {
      setImagePreviewUrl(`http://localhost:8000/uploaded_images/${src}`);
    } else {
      setImagePreviewUrl(null);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, src, mode]);

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
      {imagePreviewUrl && (
        <div className="relative w-full max-w-56 aspect-video mb-8">
          <Image
            src={imagePreviewUrl}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 224px) 100vw, 224px"
          />
        </div>
      )}
      <input
        type="file"
        id={id}
        onChange={onChange}
        required={required}
        className="hidden"
        disabled={!!imagePreviewUrl}
        accept="image/png, image/jpeg, image/webp"
        ref={ref}
      />
    </fieldset>
  );
}
