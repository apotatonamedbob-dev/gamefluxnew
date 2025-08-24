import { type NextRequest, NextResponse } from "next/server"
import gamesData from "@/data/games.json"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gameId = Number.parseInt(params.id)
    const game = gamesData.find((g) => g.id === gameId)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
