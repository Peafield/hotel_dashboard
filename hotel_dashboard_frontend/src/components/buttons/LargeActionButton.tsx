import clsx from "clsx";
import { DownloadIcon } from "../svgs/DownloadIcon";

type LargeActionButtonProps = {
  title: string;
  type: "button" | "submit";
  onClick?: () => void;
  isDownload?: boolean;
  disabled?: boolean;
  className?: string;
};

export function LargeActionButton({
  title,
  type,
  onClick,
  isDownload = false,
  disabled = false,
  className,
}: LargeActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "font-sans font-medium text-lg text-white uppercase py-3 px-5 flex cursor-pointer",
        { "items-center": !isDownload },
        { "items-center justify-between": isDownload },
        className
      )}
    >
      {title}
      {isDownload && <DownloadIcon className="size-5" />}
    </button>
  );
}
