import type { IconProps } from "@/types";

export function DeleteIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Delete Icon</title>
      <rect width="15" height="15" fill="#FF5757" />
      <g clipPath="url(#clip0_2206_1255)">
        <path
          d="M11.4375 3.5687C11.1938 3.32495 10.8 3.32495 10.5563 3.5687L7.5 6.6187L4.44375 3.56245C4.2 3.3187 3.80625 3.3187 3.5625 3.56245C3.31875 3.8062 3.31875 4.19995 3.5625 4.4437L6.61875 7.49995L3.5625 10.5562C3.31875 10.8 3.31875 11.1937 3.5625 11.4375C3.80625 11.6812 4.2 11.6812 4.44375 11.4375L7.5 8.3812L10.5563 11.4375C10.8 11.6812 11.1938 11.6812 11.4375 11.4375C11.6813 11.1937 11.6813 10.8 11.4375 10.5562L8.38125 7.49995L11.4375 4.4437C11.675 4.2062 11.675 3.8062 11.4375 3.5687Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2206_1255">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
