// app/(dashboard)/boards/page.tsx
"use client";

import { BoardCard } from "@/features/boards/components/board-card";
import { CreateBoardDialog } from "@/features/boards/components/create-board-form";
import { useGetListBoard } from "@/features/boards/hooks/useBoard";
import { Board } from "@/features/boards/types/board.type";

export default function BoardsPage() {
  const { listBoards, isLoading } = useGetListBoard();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Boards</h1>
        <CreateBoardDialog />
      </div>

      {listBoards.length === 0 ? (
        <div className="text-muted-foreground">
          No boards yet. Create your first board
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listBoards?.map((b: Board) => (
            <BoardCard key={b.id} id={b.id} name={b.name} />
          ))}
        </div>
      )}
    </div>
  );
}
