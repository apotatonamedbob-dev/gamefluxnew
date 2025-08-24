"use client"

import {
  Search,
  User,
  Heart,
  Clock,
  Bookmark,
  List,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GameCard } from "@/components/game-card"
import type { Game } from "@/types/game"
import type { Profile } from "@/types/user"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const gameCategories = [
  "Trending",
  "Popular",
  "New",
  "Multiplayer",
  "Action",
  "Sports",
  "Shooter",
  "Horror",
  "Casual",
  "Proxies",
  "Adventure",
]

export default function GameFluxHome() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([])
  const [popularGames, setPopularGames] = useState<Game[]>([])
  const [newGames, setNewGames] = useState<Game[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("Trending")
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favoritesCount, setFavoritesCount] = useState(0)

  const isAdmin = user?.email === "josiahglanton@gmail.com"

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Additional logic for handling search can be added here
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setFavoritesCount(0)
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Fetch featured games (trending)
        const featuredResponse = await fetch("/api/games?category=trending&limit=3")
        const featured = await featuredResponse.json()
        setFeaturedGames(featured)

        // Fetch recommended games (popular)
        const recommendedResponse = await fetch("/api/games?category=popular&limit=5")
        const recommended = await recommendedResponse.json()
        setRecommendedGames(recommended)

        // Fetch popular games (strategy + action)
        const popularResponse = await fetch("/api/games?limit=5")
        const popular = await popularResponse.json()
        setPopularGames(
          popular
            .filter((game: Game) => game.tags.some((tag) => ["Strategy", "Action", "Shooter"].includes(tag)))
            .slice(0, 5),
        )

        // Fetch new games (recent additions)
        const newResponse = await fetch("/api/games?limit=5")
        const newGamesData = await newResponse.json()
        setNewGames(newGamesData.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch games:", error)
      }
    }

    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        console.log("[v0] User authenticated:", user.email) // Debug logging
        setUser(user)

        // Fetch user profile
        try {
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          console.log("[v0] Profile data:", profile, "Error:", error) // Debug logging
          setProfile(profile)

          // Fetch favorites count
          const { count } = await supabase
            .from("user_favorites")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
          setFavoritesCount(count || 0)
        } catch (error) {
          console.log("[v0] Profile fetch error:", error) // Debug logging
        }
      }
    }

    fetchGames()
    checkAuth()
  }, [])

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name
    if (profile?.username) return profile.username
    if (user?.email) return user.email.split("@")[0] // Use email prefix as fallback
    return "User"
  }

  const getUsername = () => {
    if (profile?.username) return profile.username
    if (user?.email) return user.email.split("@")[0] // Use email prefix as fallback
    return "user"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Image src="/gameflux-logo.png" alt="GAMEFLUX" width={180} height={40} className="h-8 w-auto" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-gray-400">Welcome back, {getDisplayName()}</span>
                <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white hover:text-green-400">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-gray-800">
          <div className="flex items-center space-x-1 px-6 py-2 overflow-x-auto">
            {gameCategories.map((category, index) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "bg-green-500 hover:bg-green-600 text-black font-medium whitespace-nowrap"
                    : "text-gray-300 hover:text-white hover:bg-gray-800 whitespace-nowrap"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 border-r border-gray-800 bg-black/50 p-4">
          {user ? (
            /* Authenticated User */
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium">{getDisplayName()}</div>
                  <div className="text-xs text-gray-400">
                    @{getUsername()}
                    {isAdmin && <Badge className="ml-1 bg-red-600 text-white text-xs">Admin</Badge>}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-gray-300 hover:text-white"
                >
                  <Link href="/profile">View Profile</Link>
                </Button>
                {isAdmin && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-green-400 hover:text-green-300"
                  >
                    <Link href="/admin">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Guest Mode */
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium">Guest Mode</div>
                  <div className="text-xs text-gray-400">Sign in for full features</div>
                </div>
              </div>
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-gray-300 hover:text-white"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-green-400 hover:text-green-300"
                >
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Personal Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal</h3>
            <nav className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <Heart className="w-4 h-4 mr-2" />
                Favorites
                {user && favoritesCount > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-gray-700 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarks
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <List className="w-4 h-4 mr-2" />
                GameLists
              </Button>
            </nav>
          </div>

          {/* Social Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Social</h3>
            <nav className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Friends
                <Badge variant="secondary" className="ml-auto bg-gray-700 text-xs">
                  119
                </Badge>
              </Button>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-300 hover:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Featured Games */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} size="large" />
              ))}
            </div>
          </div>

          {/* Recommended Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {searchTerm ? `Search Results for "${searchTerm}"` : "Recommended"}
              </h2>
              <Button variant="link" className="text-green-400 hover:text-green-300 p-0">
                View more
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendedGames.map((game) => (
                <GameCard key={game.id} game={game} size="medium" />
              ))}
            </div>
          </section>

          {/* Popular This Week Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Popular This Week</h2>
              <Button variant="link" className="text-green-400 hover:text-green-300 p-0">
                View more
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularGames.map((game) => (
                <GameCard key={game.id} game={game} size="medium" />
              ))}
            </div>
          </section>

          {/* New Releases Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">New Releases</h2>
              <Button variant="link" className="text-green-400 hover:text-green-300 p-0">
                View more
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {newGames.map((game) => (
                <GameCard key={game.id} game={game} size="medium" />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
