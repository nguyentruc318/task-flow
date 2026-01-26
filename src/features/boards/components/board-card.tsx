"use client";

import Link from "next/link";

type Props = {
  id: string;
  name: string;
};

export function BoardCard({ id, name }: Props) {
  return (
    <Link
      href={`/boards/${id}`}
      className="rounded-lg border p-4 hover:bg-muted transition"
    >
      <h3 className="font-medium">{name}</h3>
    </Link>
  );
}
