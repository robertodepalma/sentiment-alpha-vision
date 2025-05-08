
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between mb-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      <Skeleton className="h-16 w-full mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/5" />
      </div>
    </div>
  );
};

export default PostSkeleton;
