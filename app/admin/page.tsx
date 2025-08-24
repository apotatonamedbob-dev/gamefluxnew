import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { GameManagement } from "@/components/admin/game-management"
import { AdminStats } from "@/components/admin/admin-stats"
import { Users, Gamepad2, BarChart3, Settings, Shield, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Get basic stats
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalFavorites } = await supabase.from("user_favorites").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/gameflux-logo.png" alt="GAMEFLUX" width={180} height={40} className="h-8 w-auto" />
            </Link>
            <Badge className="bg-red-600 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Admin Panel
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Admin: {profile?.display_name || user.email}</span>
            <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Link href="/profile">
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
            <form action="/auth/logout" method="post">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, games, and monitor GAMEFLUX platform activity</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers || 0}</p>
                </div>
                <Users className="w-8 h-8 text-gameflux-green" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Games</p>
                  <p className="text-2xl font-bold text-white">36</p>
                </div>
                <Gamepad2 className="w-8 h-8 text-gameflux-green" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Favorites</p>
                  <p className="text-2xl font-bold text-white">{totalFavorites || 0}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-gameflux-green" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">--</p>
                </div>
                <Shield className="w-8 h-8 text-gameflux-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Game Management
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="games">
            <GameManagement />
          </TabsContent>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
