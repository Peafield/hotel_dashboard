import { DatesBox } from "./DatesBox";
import { RoomDetailsForm } from "./form/RoomDetailsForm";

export function CreateNewRoom() {
  return (
    <section className="w-full min-h-screen overflow-y-hidden flex justify-between">
      <RoomDetailsForm />
      <DatesBox />
    </section>
  );
}
