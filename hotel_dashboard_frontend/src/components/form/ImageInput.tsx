type ImageInputProps = {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

export function ImageInput({
  id,
  onChange,
  required = false,
  className,
}: ImageInputProps) {
  return (
    <fieldset>
      <label
        htmlFor={id}
        className="block Image-xs font-medium text-hugo-dark-gray font-sans mb-4"
      >
        Image
      </label>
      <input
        type="file"
        id={id}
        onChange={onChange}
        required={required}
        className="hidden"
      />
    </fieldset>
  );
}
