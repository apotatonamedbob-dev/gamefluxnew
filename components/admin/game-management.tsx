"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import type { Game } from "@/types/game"

export function GameManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error("Error fetching games:", error)
    }
    setIsLoading(false)
  }

  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Game Management</CardTitle>
        <CardDescription className="text-gray-400">Manage games in the GAMEFLUX library</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <Button className="bg-gameflux-green hover:bg-gameflux-green/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Game
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading games...</div>
        ) : (
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Game</TableHead>
                  <TableHead className="text-gray-300">Tags</TableHead>
                  <TableHead className="text-gray-300">Published</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((game) => (
                  <TableRow key={game.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                          {game.image ? (
                            <img
                              src={game.image || "/placeholder.svg"}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-xs text-gray-500">No Image</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{game.title}</div>
                          <div className="text-sm text-gray-400">ID: {game.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {game.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {game.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                            +{game.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{new Date(game.publishDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-gameflux-green/20 text-gameflux-green">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => window.open(game.playLink, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
