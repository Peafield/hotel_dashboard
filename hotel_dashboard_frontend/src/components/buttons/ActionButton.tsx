import { type ActionButtonTypes, actionIconMap } from "@/types";
import clsx from "clsx";

type ActionButtonProps = {
	title: string;
	type: "button" | "submit";
	actionButtonType: ActionButtonTypes;
	onClick?: () => void;
	className?: string;
};

export function ActionButton({
	title,
	type,
	actionButtonType,
	onClick,
	className,
}: ActionButtonProps) {
	const IconComponent = actionIconMap[actionButtonType];
	return (
		<button
			type={type}
			onClick={onClick}
			className={clsx(
				"text-hugo-red text-xs flex items-center justify-center gap-x-1.5 cursor-pointer font-sans tracking-wider",
				className,
				{
					"underline capitalize": actionButtonType !== "return",
				},
			)}
		>
			<IconComponent className="size-3" />
			{title}
		</button>
	);
}
