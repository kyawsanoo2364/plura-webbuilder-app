"use client";

import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaType } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface IMediaBucketTab {
  subaccountId: string;
}

const MediaBucketTab: React.FC<IMediaBucketTab> = ({ subaccountId }) => {
  const [data, setData] = useState<GetMediaType>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId);
      setData(response);
    };
    fetchData();
  }, [subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} subaccountId={subaccountId} />
    </div>
  );
};
export default MediaBucketTab;
