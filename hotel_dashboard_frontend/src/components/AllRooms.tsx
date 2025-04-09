import { LargeActionButton } from "./buttons/LargeActionButton";
import { PageTitle } from "./typography/PageTitle";

type AllRoomsProps = {
  className?: string;
};

export function AllRooms({ className }: AllRoomsProps) {
  return (
    <section className="flex-1 p-4">
      <header className="w-full flex items-center justify-between">
        <PageTitle title="All rooms" />
        <LargeActionButton title="CREATE A ROOM" type="button" />
      </header>
    </section>
  );
}
