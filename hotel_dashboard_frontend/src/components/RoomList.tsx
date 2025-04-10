import { useDashboardState } from "@/store/useDashboardStore";
import type { RoomData } from "@/types";
import { formatDate } from "@/utils/formatDate";

type RoomListProps = {
  rooms: RoomData[];
};

export function RoomList({ rooms }: RoomListProps) {
  const { setDashboardViewState, setSelectedRoom } = useDashboardState();

  const handleRowClick = (room: RoomData) => {
    setSelectedRoom(room);
    setDashboardViewState("Edit");
  };

  return (
    <section className="overflow-y-auto">
      <table className="min-w-full divide-y divide-hugo-light-gray">
        <thead className="border-b-[1px] border-hugo-tan">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-bold text-hugo-dark-gray Capitalize tracking-wider font-sans"
            >
              Room
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-bold text-hugo-dark-gray Capitalize tracking-wider font-sans"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-bold text-hugo-dark-gray Capitalize tracking-wider font-sans"
            >
              Facilities
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-bold text-hugo-dark-gray Capitalize tracking-wider font-sans"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-bold text-hugo-dark-gray Capitalize tracking-wider font-sans"
            >
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-hugo-light-gray">
          {rooms.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-4 text-center text-gray-500 italic"
              >
                No rooms found.
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr
                key={room.id}
                // biome-ignore lint/a11y/useSemanticElements: <we are adding tabIndex and keyboard handling to comply>
                role="button"
                onClick={() => handleRowClick(room)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRowClick(room);
                }}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-4 whitespace-nowrap text-xs text-hugo-dark-gray font-serif cursor-pointer">
                  {room.name}
                </td>
                <td className="px-4 py-4 whitespace-normal text-xs text-hugo-dark-gray max-w-xs truncate font-serif cursor-pointer">
                  {room.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-hugo-dark-gray font-serif cursor-pointer">
                  {room.facilities?.length || 0}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-hugo-dark-gray font-serif cursor-pointer">
                  {formatDate(room.created_at)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-hugo-dark-gray font-serif cursor-pointer">
                  {formatDate(room.updated_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
