type HeadingProps = {
	title: string;
	className?: string;
};

export function Heading({ title, className }: HeadingProps) {
	return (
		<h2 className="font-sans font-medium text-[20px] text-hugo-dark-gray mb-4">
			{title}
		</h2>
	);
}
