"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  gameId: string
  className?: string
}

export function FavoriteButton({ gameId, className }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if game is already favorited
        const { data } = await supabase
          .from("user_favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("game_id", gameId)
          .single()

        setIsFavorited(!!data)
      }
    }

    checkAuth()
  }, [gameId])

  const toggleFavorite = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites?gameId=${gameId}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setIsFavorited(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId }),
        })
        if (response.ok) {
          setIsFavorited(true)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }

    setIsLoading(false)
  }

  if (!user) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn("text-gray-400 hover:text-red-400", isFavorited && "text-red-400", className)}
    >
      <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
    </Button>
  )
}
