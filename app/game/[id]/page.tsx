"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, Heart, Share2, Calendar, Tag, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Game } from "@/types/game"
import Image from "next/image"

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [relatedGames, setRelatedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Fetch game details
        const gameResponse = await fetch(`/api/games/${params.id}`)
        if (gameResponse.ok) {
          const gameData = await gameResponse.json()
          setGame(gameData)

          // Fetch related games based on tags
          if (gameData.tags.length > 0) {
            const relatedResponse = await fetch(`/api/games?category=${gameData.tags[0]}&limit=4`)
            const related = await relatedResponse.json()
            setRelatedGames(related.filter((g: Game) => g.id !== gameData.id).slice(0, 4))
          }
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGameData()
    }
  }, [params.id])

  const handlePlayGame = () => {
    if (game?.playLink) {
      window.open(game.playLink, "_blank")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: game?.title,
          text: `Check out ${game?.title} on GAMEFLUX!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="flex h-16 items-center justify-between px-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={
                isFavorited ? "text-red-500 hover:text-red-400" : "text-muted-foreground hover:text-foreground"
              }
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-foreground">{game.title}</h1>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Added {new Date(game.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {game.tags.includes("Multiplayer") ? "Multiplayer" : "Single Player"}
                </div>
              </div>
            </div>

            {/* Game Screenshot/Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={game.image || "/placeholder.svg?height=400&width=600&query=game screenshot"}
                  alt={game.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/fantasy-game-battle.png"
                  }}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" onClick={handlePlayGame} className="bg-primary hover:bg-primary/90">
                    <Play className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Game Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Game</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Experience the thrill of {game.title}! This {game.tags.join(", ").toLowerCase()} game offers hours of
                  entertainment with its engaging gameplay and stunning visuals. Whether you're a casual gamer or a
                  hardcore enthusiast, {game.title} provides the perfect gaming experience for players of all skill
                  levels.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Play Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  size="lg"
                  onClick={handlePlayGame}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play {game.title}
                </Button>
                <div className="flex items-center justify-center mt-3 text-sm text-muted-foreground">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Opens in new tab
                </div>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Game Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genre:</span>
                    <span className="text-foreground">{game.tags[0] || "Action"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players:</span>
                    <span className="text-foreground">
                      {game.tags.includes("Multiplayer") ? "Multiplayer" : "Single Player"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="text-foreground">Web Browser</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Added:</span>
                    <span className="text-foreground">{new Date(game.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Games */}
            {relatedGames.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Related Games</h3>
                  <div className="space-y-3">
                    {relatedGames.map((relatedGame) => (
                      <div
                        key={relatedGame.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/game/${relatedGame.id}`)}
                      >
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                          <Image
                            src={relatedGame.image || "/placeholder.svg?height=48&width=48&query=game icon"}
                            alt={relatedGame.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/generic-game-icon.png"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{relatedGame.title}</p>
                          <p className="text-xs text-muted-foreground">{relatedGame.tags[0]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
