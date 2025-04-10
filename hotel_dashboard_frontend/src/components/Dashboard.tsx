"use client";

// import { dummyRoomData } from "@/DummyData/dummyData";
import { useDashboardState } from "@/store/useDashboardStore";
import { viewTitleMap } from "@/types";
import { useEffect } from "react";
import { RoomDetails } from "./RoomDetails";
import { RoomList } from "./RoomList";
import { ActionButton } from "./buttons/ActionButton";
import { LargeActionButton } from "./buttons/LargeActionButton";
import { PageTitle } from "./typography/PageTitle";
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal";

export function Dashboard() {
  const {
    dashboardViewState,
    selectedRoom,
    rooms,
    setDashboardViewState,
    setSelectedRoom,
    loadRooms,
    isDeleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRoom,
  } = useDashboardState();
  const pageTitle = viewTitleMap[dashboardViewState];

  useEffect(() => {
    if (dashboardViewState === "RoomList") {
      loadRooms();
    }
  }, [dashboardViewState, loadRooms]);

  const handleFormSubmitSuccess = () => {
    setDashboardViewState("RoomList");
  };

  return (
    <section className="flex-1 pl-8">
      <header className="w-full flex items-center justify-between mb-8">
        <div className="flex flex-col items-start">
          <PageTitle title={pageTitle} />
          {dashboardViewState !== "RoomList" && (
            <ActionButton
              title="back to rooms"
              actionButtonType="return"
              type="button"
              onClick={() => {
                setSelectedRoom(undefined);
                setDashboardViewState("RoomList");
              }}
            />
          )}
        </div>
        {dashboardViewState === "RoomList" && (
          <LargeActionButton
            title="CREATE A ROOM"
            type="button"
            onClick={() => setDashboardViewState("Create")}
            className="bg-hugo-red mt-8"
          />
        )}
      </header>
      {dashboardViewState === "RoomList" && <RoomList rooms={rooms} />}
      {dashboardViewState !== "RoomList" && (
        <RoomDetails
          room={selectedRoom}
          onSubmitSucess={handleFormSubmitSuccess}
        />
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteRoom}
        isLoading={isDeleting}
      />
    </section>
  );
}
