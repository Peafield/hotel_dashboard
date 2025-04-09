type ActionButtonProps = {
  title: string;
  type: "button" | "submit";
  icon?: React.ReactNode;
  className?: string;
};

export function ActionButton({
  title,
  type,
  icon,
  className,
}: ActionButtonProps) {
  return (
    <button type={type} className="text-hugo-red text-lg underline uppercase">
      <span>{icon}</span>
      {title}
    </button>
  );
}
