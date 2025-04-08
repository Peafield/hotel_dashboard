type ActionButtonProps = {
  title: string;
  type: "button" | "submit";
  className?: string;
};

export function ActionButton({ title, type, className }: ActionButtonProps) {
  return (
    <button
      type={type}
      className="bg-hugo-red font-sans font-medium text-lg text-white py-4 px-5 flex items-center justify-center cursor-pointer"
    >
      {title}
    </button>
  );
}
