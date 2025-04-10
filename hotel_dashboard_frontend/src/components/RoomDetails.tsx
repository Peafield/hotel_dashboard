"use client";

import { useDashboardState } from "@/store/useDashboardStore";
import type { RoomData } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { DatesBox } from "./DatesBox";
import { RoomDetailsForm } from "./form/RoomDetailsForm";

type RoomDetailsProps = {
  room?: RoomData;
  onSubmitSucess: () => void;
};

export function RoomDetails({ room, onSubmitSucess }: RoomDetailsProps) {
  const { dashboardViewState } = useDashboardState();
  let roomCreatedAt = "";
  let roomUpdatedAt = "";
  if (room && dashboardViewState === "Edit") {
    roomCreatedAt = formatDate(room.created_at);
    roomUpdatedAt = formatDate(room.updated_at);
  } else {
    roomCreatedAt = new Date().toLocaleDateString("en-GB");
    roomUpdatedAt = "-";
  }
  return (
    <section className="w-full min-h-screen overflow-y-hidden flex justify-between">
      <RoomDetailsForm roomData={room} onSubmitSuccess={onSubmitSucess} />
      <DatesBox
        dashboardViewState={dashboardViewState}
        selectedRoom={room}
        createdAt={roomCreatedAt}
        updatedAt={roomUpdatedAt}
      />
    </section>
  );
}
