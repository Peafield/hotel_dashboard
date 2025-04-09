import type { IconProps } from "@/types";

export function AddIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Add Icon</title>
      <rect width="15" height="15" fill="#FF5757" />
      <g clipPath="url(#clip0_2207_91)">
        <path
          d="M11.25 8.125H8.125V11.25C8.125 11.5938 7.84375 11.875 7.5 11.875C7.15625 11.875 6.875 11.5938 6.875 11.25V8.125H3.75C3.40625 8.125 3.125 7.84375 3.125 7.5C3.125 7.15625 3.40625 6.875 3.75 6.875H6.875V3.75C6.875 3.40625 7.15625 3.125 7.5 3.125C7.84375 3.125 8.125 3.40625 8.125 3.75V6.875H11.25C11.5938 6.875 11.875 7.15625 11.875 7.5C11.875 7.84375 11.5938 8.125 11.25 8.125Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2207_91">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
