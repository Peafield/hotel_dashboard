import { deleteRoom, fetchRooms } from "@/lib/apiClient";
import type { DashBoardViewState, RoomData } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardState {
  rooms: RoomData[];
  dashboardViewState: DashBoardViewState;
  selectedRoom: RoomData | undefined;
  isDeleteModalOpen: boolean;
  roomToDeleteId: string | null;
  isDeleting: boolean;
  isLoading: boolean;
  error: string | null;
  setDashboardViewState: (dashboardViewState: DashBoardViewState) => void;
  setSelectedRoom: (selectedroom: RoomData | undefined) => void;
  setRooms: (roomData: RoomData[]) => Promise<void>;
  loadRooms: () => Promise<void>;
  add: (newRoom: RoomData) => void;
  update: (updatedRoom: RoomData) => void;
  openDeleteModal: (roomId: string) => void;
  closeDeleteModal: () => void;
  confirmDeleteRoom: () => Promise<void>;
}

export const useDashboardState = create<DashboardState>()(
  devtools((set, get) => ({
    rooms: [],
    dashboardViewState: "RoomList",
    selectedRoom: undefined,
    isDeleteModalOpen: false,
    roomToDeleteId: null,
    isDeleting: false,
    isLoading: false,
    setDashboardViewState: (dashboardViewState: DashBoardViewState) => {
      set({ dashboardViewState });
    },
    setSelectedRoom: (selectedRoom: RoomData) => {
      set({ selectedRoom });
    },
    setRooms: async (roomData: RoomData[]) => {
      set({ rooms: roomData });
    },
    loadRooms: async () => {
      set({ isLoading: true, error: null });
      try {
        const fetchedRooms = await fetchRooms();
        set({ rooms: fetchedRooms, isLoading: false });
      } catch (error) {
        console.error("Error loading rooms in store:", error);
        set({
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Failed to load rooms",
        });
      }
    },
    add: (newRoom: RoomData) => {
      set((state) => ({ rooms: [...state.rooms, newRoom] }));
    },
    update: (updatedRoom: RoomData) => {
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room
        ),
      }));
    },
    openDeleteModal: (roomId: string) => {
      set({ isDeleteModalOpen: true, roomToDeleteId: roomId });
    },
    closeDeleteModal: () => {
      set({
        isDeleteModalOpen: false,
        roomToDeleteId: null,
        isDeleting: false,
      });
    },
    confirmDeleteRoom: async () => {
      const roomId = get().roomToDeleteId;
      if (!roomId) return;

      set({ isDeleting: true });
      try {
        await deleteRoom(roomId);
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== roomId),
          isDeleteModalOpen: false,
          roomToDeleteId: null,
          dashboardViewState: "RoomList",
          selectedRoom: undefined,
        }));
      } catch (error) {
        console.error("Failed to delete room:", error);
        alert(
          `Error deleting room: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        set({ isDeleting: false });
      }
    },
  }))
);
