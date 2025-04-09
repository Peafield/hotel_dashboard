import clsx from "clsx";

type LargeActionButtonProps = {
  title: string;
  type: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function LargeActionButton({
  title,
  type,
  onClick,
  disabled = false,
  className,
}: LargeActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "bg-hugo-red font-sans font-medium text-lg text-white uppercase py-3 px-5 flex items-center justify-center cursor-pointer",
        className
      )}
    >
      {title}
    </button>
  );
}
