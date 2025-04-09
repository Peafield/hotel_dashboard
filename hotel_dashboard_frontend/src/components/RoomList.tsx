import type { RoomData } from "@/types";

type RoomListProps = {
  rooms: RoomData[];
  className?: string;
};

export function RoomList({ rooms, className }: RoomListProps) {
  const formatDate = (dateString: string | undefined) => {
    try {
      if (dateString) return new Date(dateString).toLocaleDateString("en-GB");
      return "-";
    } catch (e) {
      return "Invalid Date";
    }
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
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-[12px] text-hugo-dark-gray font-serif cursor-pointer">
                  {room.name}
                </td>
                <td className="px-4 py-4 whitespace-normal text-[12px] text-hugo-dark-gray max-w-xs truncate font-serif cursor-pointer">
                  {room.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px] text-hugo-dark-gray font-serif cursor-pointer">
                  {room.facilities?.length || 0}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px] text-hugo-dark-gray font-serif cursor-pointer">
                  {formatDate(room.created_at)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px] text-hugo-dark-gray font-serif cursor-pointer">
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
