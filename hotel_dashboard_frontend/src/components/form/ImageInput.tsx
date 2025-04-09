import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";

type ImageInputProps = {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  selectedFile: File | null;
  ref?: React.Ref<HTMLInputElement>;
};

export function ImageInput({
  id,
  onChange,
  required = false,
  selectedFile,
  ref,
  className,
}: ImageInputProps) {
  const imagePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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
