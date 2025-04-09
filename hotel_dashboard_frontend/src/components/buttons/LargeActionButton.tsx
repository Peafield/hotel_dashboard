type LargeActionButtonProps = {
  title: string;
  type: "button" | "submit";
  className?: string;
};

export function LargeActionButton({
  title,
  type,
  className,
}: LargeActionButtonProps) {
  return (
    <button
      type={type}
      className="bg-hugo-red font-sans font-medium text-lg text-white uppercase py-3 px-5 flex items-center justify-center cursor-pointer"
    >
      {title}
    </button>
  );
}
