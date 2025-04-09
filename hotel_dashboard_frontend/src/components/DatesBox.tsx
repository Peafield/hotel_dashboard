import { Heading } from "./typography/Heading";

export function DatesBox() {
  // TODO: pass in room data if it exists, if not updated is "-" and created data is today's date
  return (
    <aside className="w-96 h-36 bg-hugo-tan py-6 pl-6 pr-20">
      <Heading title="Dates" />
      <dl className="flex justify-between">
        <div className="flex flex-col justify-between mb-1">
          <dt className="text-xs font-sans font-semibold">Created</dt>
          <dd className="text-[13px] font-serif font-normal">09/04/2025</dd>
        </div>
        <div className="flex flex-col justify-between">
          <dt className="text-xs font-sans font-semibold">Updated</dt>
          <dd className="text-[13px] font-serif">-</dd>
        </div>
      </dl>
    </aside>
  );
}
