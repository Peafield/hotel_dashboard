import type { PageTitles } from "@/types";

type PageTitleProps = {
  title: PageTitles;
  className?: string;
};

export function PageTitle({ title, className }: PageTitleProps) {
  return (
    <h1 className="font-sans font-medium text-[40px] text-hugo-dark-gray">
      {title}
    </h1>
  );
}
