import type { DashBoardViewState, RoomData } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardState {
  rooms: RoomData[];
  dashboardViewState: DashBoardViewState;
  isDeletingExistingRoom: boolean;
  isLoading: boolean;
  setDashboardViewState: (dashboardViewState: DashBoardViewState) => void;
  setRooms: (roomData: RoomData[]) => Promise<void>;
  add: (newRoom: RoomData) => void;
}

export const useDashboardState = create<DashboardState>()(
  devtools((set) => ({
    rooms: [],
    dashboardViewState: "RoomList",
    isDeletingExistingRoom: false,
    isLoading: false,
    setDashboardViewState: (dashboardViewState: DashBoardViewState) => {
      set({ dashboardViewState });
    },
    setRooms: async (roomData: RoomData[]) => {
      set({ rooms: roomData });
    },
    add: (newRoom: RoomData) => {
      set((state) => ({ rooms: [...state.rooms, newRoom] }));
    },
  }))
);
