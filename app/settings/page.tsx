import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Palette, Globe, Lock, Trash2, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/gameflux-logo.png" alt="GAMEFLUX" width={180} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Privacy & Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-gameflux-green data-[state=active]:text-white text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="account" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Account Status</CardTitle>
                <CardDescription className="text-gray-400">Your account information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Account Type</span>
                  <Badge className={profile?.is_admin ? "bg-gameflux-green text-white" : "bg-gray-700 text-white"}>
                    {profile?.is_admin ? "Admin" : "User"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Email Verified</span>
                  <Badge className="bg-gameflux-green text-white">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Member Since</span>
                  <span className="text-gray-400">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Password & Authentication</CardTitle>
                <CardDescription className="text-gray-400">Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="security" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Control who can see your information and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="privacy" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="notifications" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Theme & Display</CardTitle>
                <CardDescription className="text-gray-400">Customize how GAMEFLUX looks and feels</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="appearance" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Gaming Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Set your gaming preferences and content filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm user={user} profile={profile} section="preferences" />
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-800">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-gray-400">Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </Button>
                <p className="text-sm text-gray-400 mt-2">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
