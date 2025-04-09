type TextInputProps = {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

export function TextInput({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className,
}: TextInputProps) {
  return (
    <fieldset className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-hugo-dark-gray font-sans mb-2"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full h-11 px-3 py-2 bg-hugo-light-gray border border-transparent text-hugo-dark-gray font-serif text-[13px] tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hugo-red"
      />
    </fieldset>
  );
}
