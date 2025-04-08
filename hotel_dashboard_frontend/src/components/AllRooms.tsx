import { ActionButton } from "./buttons/ActionButton";
import { PageTitle } from "./typography/PageTitle";

type AllRoomsProps = {
  className?: string;
};

export function AllRooms({ className }: AllRoomsProps) {
  return (
    <section className="flex-1 p-4">
      <header className="w-full flex items-center justify-between">
        <PageTitle title="All rooms" />
        <ActionButton title="CREATE A ROOM" type="button" />
      </header>
    </section>
  );
}
