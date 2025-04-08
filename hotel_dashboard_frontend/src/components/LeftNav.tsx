import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "./svgs/HomeIcon";

export function LeftNav() {
  return (
    <nav className="w-[200px] h-screen bg-hugo-dark-gray">
      <div className="mb-8 p-6">
        <Image
          src={"/assets/hugo_logo.png"}
          alt="Logo for The Hugo hotel"
          width={160.23}
          height={58}
        />
      </div>
      <ul className="flex flex-row items-center justify-center">
        <li className="w-full border-s-4 border-hugo-red  ">
          <Link
            href={"#"}
            className="text-hugo-light-gray text-sm flex items-center gap-x-2 pl-3.5"
          >
            <HomeIcon className="size-4.5" /> Room List
          </Link>
        </li>
      </ul>
    </nav>
  );
}
