"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/types/game"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface GameCardProps {
  game: Game
  size?: "small" | "medium" | "large"
}

export function GameCard({ game, size = "medium" }: GameCardProps) {
  const router = useRouter()

  const sizeClasses = {
    small: "h-32",
    medium: "h-40",
    large: "h-48",
  }

  const handleCardClick = () => {
    router.push(`/game/${game.id}`)
  }

  return (
    <Card
      className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-gray-700 to-gray-800`}>
        {game.image && game.image !== "" && !game.image.includes("../") ? (
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl font-bold text-green-500 opacity-50">{game.title.charAt(0)}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute top-2 right-2">
          {game.tags.slice(0, 1).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate group-hover:text-green-400 transition-colors">
          {game.title}
        </h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {game.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}
