import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Heart, Clock, Bookmark, Settings, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user favorites count
  const { count: favoritesCount } = await supabase
    .from("user_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/gameflux-logo.png" alt="GAMEFLUX" width={180} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gameflux-green/20 rounded-full flex items-center justify-center mb-4">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gameflux-green" />
                  )}
                </div>
                <CardTitle className="text-xl text-white">{profile?.display_name || "Gaming Enthusiast"}</CardTitle>
                <CardDescription className="text-gray-400">
                  @{profile?.username || "user"}
                  {profile?.is_admin && <Badge className="ml-2 bg-gameflux-green text-white">Admin</Badge>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.bio && <p className="text-sm text-gray-300 text-center">{profile.bio}</p>}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">{favoritesCount || 0}</div>
                    <div className="text-xs text-gray-400">Favorites</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">0</div>
                    <div className="text-xs text-gray-400">Reviews</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">0</div>
                    <div className="text-xs text-gray-400">Friends</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  My Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  Recently Played
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                {profile?.is_admin && (
                  <Button asChild className="w-full bg-gameflux-green hover:bg-gameflux-green/90 text-white">
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Profile Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} profile={profile} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
