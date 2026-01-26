// BoardHeader.tsx
import { Button } from "@/components/ui/button";
import { BoardDetail } from "../types/board.type";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function BoardHeader({ board }: { board: BoardDetail }) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex gap-3 items-center justify-between">
        <SidebarTrigger />

        <h1 className="text-xl font-semibold">Board: {board.name}</h1>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Members
        </Button>
        <Button variant="outline" size="sm">
          Settings
        </Button>
      </div>
    </div>
  );
}
