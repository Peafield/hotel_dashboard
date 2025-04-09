import type { IconProps } from "@/types";

export function ReturnIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Return Icon</title>
      <path
        d="M6.71001 0.70998C6.32001 0.31998 5.69001 0.31998 5.30001 0.70998L0.710011 5.29998C0.320011 5.68998 0.320011 6.31998 0.710011 6.70998L5.30001 11.3C5.69001 11.69 6.32001 11.69 6.71001 11.3C7.10001 10.91 7.10001 10.28 6.71001 9.88998L2.83001 5.99998L6.71001 2.11998C7.10001 1.72998 7.09001 1.08998 6.71001 0.70998Z"
        fill="#FF5757"
      />
    </svg>
  );
}
