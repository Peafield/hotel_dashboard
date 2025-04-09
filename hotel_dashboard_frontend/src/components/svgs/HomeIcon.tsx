import type { IconProps } from "@/types";

export function HomeIcon({ className }: IconProps) {
	return (
		<svg
			viewBox="0 0 20 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<title>Home Icon</title>
			<path
				d="M17 6.3V2C17 1.45 16.55 1 16 1H15C14.45 1 14 1.45 14 2V3.6L10.67 0.600001C10.29 0.260001 9.70998 0.260001 9.32998 0.600001L0.969976 8.13C0.629976 8.43 0.839976 9 1.29998 9H2.99998V16C2.99998 16.55 3.44998 17 3.99998 17H6.99998C7.54998 17 7.99998 16.55 7.99998 16V11H12V16C12 16.55 12.45 17 13 17H16C16.55 17 17 16.55 17 16V9H18.7C19.16 9 19.38 8.43 19.03 8.13L17 6.3ZM7.99998 7C7.99998 5.9 8.89998 5 9.99998 5C11.1 5 12 5.9 12 7H7.99998Z"
				fill="#FF5757"
			/>
		</svg>
	);
}
