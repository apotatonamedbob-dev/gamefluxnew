"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { User } from "@supabase/supabase-js"
import { Eye, EyeOff, Save } from "lucide-react"

interface SettingsFormProps {
  user: User
  profile: any
  section: "account" | "security" | "privacy" | "notifications" | "appearance" | "preferences"
}

export function SettingsForm({ user, profile, section }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Account
    username: profile?.username || "",
    displayName: profile?.display_name || "",
    bio: profile?.bio || "",
    email: user.email || "",

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Privacy
    profileVisibility: "public",
    showEmail: false,
    showActivity: true,

    // Notifications
    emailNotifications: true,
    gameUpdates: true,
    friendRequests: true,
    systemAlerts: true,

    // Appearance
    theme: "dark",
    accentColor: "green",
    compactMode: false,

    // Preferences
    defaultGameFilter: "all",
    autoplay: false,
    showMatureContent: false,
    language: "en",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, ...formData }),
      })

      if (response.ok) {
        // Handle success
        console.log("Settings updated successfully")
      } else {
        console.error("Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-white">
            Display Name
          </Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter display name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-800 border-gray-700 text-gray-400"
        />
        <p className="text-sm text-gray-400">Email cannot be changed. Contact support if needed.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="Tell us about yourself..."
          rows={3}
        />
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Change Password</h3>
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-white">
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Profile Visibility</Label>
            <p className="text-sm text-gray-400">Who can see your profile</p>
          </div>
          <Select
            value={formData.profileVisibility}
            onValueChange={(value) => setFormData({ ...formData, profileVisibility: value })}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="public" className="text-white">
                Public
              </SelectItem>
              <SelectItem value="friends" className="text-white">
                Friends
              </SelectItem>
              <SelectItem value="private" className="text-white">
                Private
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Show Email</Label>
            <p className="text-sm text-gray-400">Display email on your profile</p>
          </div>
          <Switch
            checked={formData.showEmail}
            onCheckedChange={(checked) => setFormData({ ...formData, showEmail: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Show Activity</Label>
            <p className="text-sm text-gray-400">Display your gaming activity</p>
          </div>
          <Switch
            checked={formData.showActivity}
            onCheckedChange={(checked) => setFormData({ ...formData, showActivity: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Email Notifications</Label>
            <p className="text-sm text-gray-400">Receive notifications via email</p>
          </div>
          <Switch
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
          />
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Game Updates</Label>
            <p className="text-sm text-gray-400">New games and updates</p>
          </div>
          <Switch
            checked={formData.gameUpdates}
            onCheckedChange={(checked) => setFormData({ ...formData, gameUpdates: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Friend Requests</Label>
            <p className="text-sm text-gray-400">When someone sends a friend request</p>
          </div>
          <Switch
            checked={formData.friendRequests}
            onCheckedChange={(checked) => setFormData({ ...formData, friendRequests: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">System Alerts</Label>
            <p className="text-sm text-gray-400">Important system notifications</p>
          </div>
          <Switch
            checked={formData.systemAlerts}
            onCheckedChange={(checked) => setFormData({ ...formData, systemAlerts: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Theme</Label>
            <p className="text-sm text-gray-400">Choose your preferred theme</p>
          </div>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="dark" className="text-white">
                Dark
              </SelectItem>
              <SelectItem value="light" className="text-white">
                Light
              </SelectItem>
              <SelectItem value="auto" className="text-white">
                Auto
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Accent Color</Label>
            <p className="text-sm text-gray-400">Primary accent color</p>
          </div>
          <Select
            value={formData.accentColor}
            onValueChange={(value) => setFormData({ ...formData, accentColor: value })}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="green" className="text-white">
                Green
              </SelectItem>
              <SelectItem value="blue" className="text-white">
                Blue
              </SelectItem>
              <SelectItem value="purple" className="text-white">
                Purple
              </SelectItem>
              <SelectItem value="red" className="text-white">
                Red
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Compact Mode</Label>
            <p className="text-sm text-gray-400">Use compact layout</p>
          </div>
          <Switch
            checked={formData.compactMode}
            onCheckedChange={(checked) => setFormData({ ...formData, compactMode: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Default Game Filter</Label>
            <p className="text-sm text-gray-400">Default category when browsing</p>
          </div>
          <Select
            value={formData.defaultGameFilter}
            onValueChange={(value) => setFormData({ ...formData, defaultGameFilter: value })}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">
                All
              </SelectItem>
              <SelectItem value="trending" className="text-white">
                Trending
              </SelectItem>
              <SelectItem value="new" className="text-white">
                New
              </SelectItem>
              <SelectItem value="popular" className="text-white">
                Popular
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Autoplay Videos</Label>
            <p className="text-sm text-gray-400">Automatically play game trailers</p>
          </div>
          <Switch
            checked={formData.autoplay}
            onCheckedChange={(checked) => setFormData({ ...formData, autoplay: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Show Mature Content</Label>
            <p className="text-sm text-gray-400">Display mature-rated games</p>
          </div>
          <Switch
            checked={formData.showMatureContent}
            onCheckedChange={(checked) => setFormData({ ...formData, showMatureContent: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Language</Label>
            <p className="text-sm text-gray-400">Interface language</p>
          </div>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="en" className="text-white">
                English
              </SelectItem>
              <SelectItem value="es" className="text-white">
                Spanish
              </SelectItem>
              <SelectItem value="fr" className="text-white">
                French
              </SelectItem>
              <SelectItem value="de" className="text-white">
                German
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {section === "account" && renderAccountSection()}
      {section === "security" && renderSecuritySection()}
      {section === "privacy" && renderPrivacySection()}
      {section === "notifications" && renderNotificationsSection()}
      {section === "appearance" && renderAppearanceSection()}
      {section === "preferences" && renderPreferencesSection()}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-gameflux-green hover:bg-gameflux-green/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
