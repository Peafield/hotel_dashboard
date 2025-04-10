import type { DashBoardViewState, RoomData } from "@/types";
import { LargeActionButton } from "./buttons/LargeActionButton";
import { Heading } from "./typography/Heading";
import { useState } from "react";
import { downloadPdf } from "@/lib/apiClient";

type DatesBoxProps = {
  dashboardViewState: DashBoardViewState;
  selectedRoom?: RoomData;
  createdAt?: string;
  updatedAt?: string;
};

export function DatesBox({
  dashboardViewState,
  selectedRoom,
  createdAt,
  updatedAt,
}: DatesBoxProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!selectedRoom || !selectedRoom.id) return;

    setIsDownloadingPdf(true);
    try {
      const blob = await downloadPdf(selectedRoom.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `room_${selectedRoom.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download failed", err);
      alert(
        `Failed to download PDF: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <section className="w-96">
      <aside className="w-full h-36 bg-hugo-tan py-6 pl-6 pr-20">
        <Heading title="Dates" />
        <dl className="flex justify-between">
          <div className="flex flex-col justify-between mb-1">
            <dt className="text-xs font-sans font-semibold">Created</dt>
            <dd className="text-[13px] font-serif font-normal">{createdAt}</dd>
          </div>
          <div className="flex flex-col justify-between">
            <dt className="text-xs font-sans font-semibold">Updated</dt>
            <dd className="text-[13px] font-serif">{updatedAt}</dd>
          </div>
        </dl>
      </aside>
      {dashboardViewState === "Edit" && (
        <LargeActionButton
          title={isDownloadingPdf ? "Downloading pdf ..." : "Download pdf"}
          type="submit"
          isDownload={true}
          onClick={handleDownloadPdf}
          className="w-full bg-hugo-red mt-6"
        />
      )}
    </section>
  );
}
