import { dummyRoomData } from "@/DummyData/dummyData";
import { LargeActionButton } from "./buttons/LargeActionButton";
import { RoomList } from "./RoomList";
import { PageTitle } from "./typography/PageTitle";

type AllRoomsProps = {
  className?: string;
};

export function AllRooms({ className }: AllRoomsProps) {
  return (
    <section className="flex-1 p-4">
      <header className="w-full flex items-center justify-between mb-8">
        <PageTitle title="All rooms" />
        <LargeActionButton title="CREATE A ROOM" type="button" />
      </header>
      <RoomList rooms={dummyRoomData} />
    </section>
  );
}
