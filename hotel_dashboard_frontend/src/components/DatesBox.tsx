import type { DashBoardViewState, RoomData } from "@/types";
import { LargeActionButton } from "./buttons/LargeActionButton";
import { Heading } from "./typography/Heading";

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
	const handleDownloadPdf = () => {
		console.log(`handling download of pdf of ${selectedRoom}`);
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
					title="Download pdf"
					type="submit"
					isDownload={true}
					onClick={handleDownloadPdf}
					className="w-full mt-6"
				/>
			)}
		</section>
	);
}
