type TextAreaInputProps = {
	label: string;
	id: string;
	name: string;
	placeholder: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	required?: boolean;
};

export function TextAreaInput({
	label,
	id,
	name,
	placeholder,
	value,
	onChange,
	required = false,
}: TextAreaInputProps) {
	return (
		<fieldset className="mb-4">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-hugo-dark-gray font-sans mb-1"
			>
				{label}
			</label>
			<textarea
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				className="block w-full px-3 py-2 bg-hugo-light-gray border border-transparent text-hugo-dark-gray text-[13px] tracking-wider font-serif resize-none"
			/>
		</fieldset>
	);
}
