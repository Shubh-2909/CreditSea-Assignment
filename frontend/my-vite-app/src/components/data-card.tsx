import { Landmark, LucideIcon } from "lucide-react";
import Image from "next/image";

const DataCard = ({
  image,
  data,
  title,
}: {
  image: string;
  data: number;
  title: string;
}) => {
  return (
    <div className="w-[270px] h-24 flex items-center border shadow-md">
      <div className="w-[30%] h-full flex items-center justify-center text-white bg-[#384B70]">
        <Image
          src={image}
          alt={image}
          width={50}
          height={30}
          className="size-10"
        />
      </div>
      <div className="w-[70%] p-4">
        <p className="text-xl font-semibold">{data}</p>
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  );
};

export default DataCard;
