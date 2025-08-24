import { type NextRequest, NextResponse } from "next/server"
import gamesData from "@/data/games.json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const limit = searchParams.get("limit")

  let filteredGames = gamesData.filter((game) => game.title && game.title.trim() !== "")

  // Filter by category/tag
  if (category && category !== "all") {
    filteredGames = filteredGames.filter((game) =>
      game.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()),
    )
  }

  // Filter by search term
  if (search) {
    const searchTerm = search.toLowerCase()
    filteredGames = filteredGames.filter(
      (game) =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Limit results
  if (limit) {
    filteredGames = filteredGames.slice(0, Number.parseInt(limit))
  }

  return NextResponse.json(filteredGames)
}
