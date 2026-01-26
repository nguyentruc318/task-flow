// app/(dashboard)/boards/[boardId]/page.tsx
"use client";

import { useParams } from "next/navigation";

import BoardHeader from "@/features/boards/components/board-header";
import BoardColumns from "@/features/boards/components/board-columns";
import { useGetBoardDetail } from "@/features/boards/hooks/useBoard";

export default function BoardDetailPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boardDetail, isLoading } = useGetBoardDetail(boardId);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!boardDetail) return <div className="p-6">Board not found</div>;

  return (
    <div className="flex h-full flex-col">
      <BoardHeader board={boardDetail.data} />
      <BoardColumns
        columns={boardDetail.data.columns}
        boardId={boardDetail.data.id}
      />
    </div>
  );
}
