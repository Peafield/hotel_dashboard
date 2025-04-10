import { fetchRooms } from "@/lib/apiClient";
import type { DashBoardViewState, RoomData } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardState {
  rooms: RoomData[];
  dashboardViewState: DashBoardViewState;
  selectedRoom: RoomData | undefined;
  isDeletingExistingRoom: boolean;
  isLoading: boolean;
  error: string | null;
  setDashboardViewState: (dashboardViewState: DashBoardViewState) => void;
  setSelectedRoom: (selectedroom: RoomData | undefined) => void;
  setRooms: (roomData: RoomData[]) => Promise<void>;
  loadRooms: () => Promise<void>;
  add: (newRoom: RoomData) => void;
}

export const useDashboardState = create<DashboardState>()(
  devtools((set) => ({
    rooms: [],
    dashboardViewState: "RoomList",
    selectedRoom: undefined,
    isDeletingExistingRoom: false,
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
  }))
);
