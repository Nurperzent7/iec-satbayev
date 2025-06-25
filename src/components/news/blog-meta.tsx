import Image from "next/image";

import { NewsMetadata } from "@/lib/news/types";
import { formatUTCDate } from "@/lib/utils";

interface BlogMetaProps {
  data: NewsMetadata;
}



export default function BlogMeta({ data }: BlogMetaProps) {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col w-full md:w-[700px] gap-4">
        <h2 className="text-3xl font-bold">{data.title}</h2>
        <p className="text-secondary-foreground"> {formatUTCDate(data.date)} </p>
      </div>
      {data.image &&
        <div className="w-full flex rounded overflow-hidden">
          <Image src={data.image} alt={data.title} width={1000} height={800} />
        </div>
      }
    </div>
  );
}
