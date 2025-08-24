import { NextResponse } from "next/server"
import gamesData from "@/data/games.json"

export async function GET() {
  // Extract all unique tags from games
  const allTags = gamesData
    .filter((game) => game.title && game.title.trim() !== "")
    .flatMap((game) => game.tags)
    .filter((tag) => tag && tag.trim() !== "")

  const uniqueTags = [...new Set(allTags)].sort()

  return NextResponse.json(uniqueTags)
}
