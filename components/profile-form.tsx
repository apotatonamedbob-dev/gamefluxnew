"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/user"

interface ProfileFormProps {
  user: User
  profile: Profile | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: profile?.username || "",
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: formData.username || null,
        display_name: formData.display_name || null,
        bio: formData.bio || null,
        avatar_url: formData.avatar_url || null,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setSuccess(true)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gameflux-green focus:ring-gameflux-green"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display_name" className="text-white">
            Display Name
          </Label>
          <Input
            id="display_name"
            type="text"
            placeholder="How others will see you"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gameflux-green focus:ring-gameflux-green"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url" className="text-white">
          Avatar URL
        </Label>
        <Input
          id="avatar_url"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={formData.avatar_url}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gameflux-green focus:ring-gameflux-green"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gameflux-green focus:ring-gameflux-green min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Email</Label>
        <Input type="email" value={user.email || ""} disabled className="bg-gray-800 border-gray-700 text-gray-400" />
        <p className="text-xs text-gray-500">Email cannot be changed from this page</p>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">{error}</p>}

      {success && (
        <p className="text-sm text-gameflux-green bg-gameflux-green/20 p-3 rounded-md border border-gameflux-green/30">
          Profile updated successfully!
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-gameflux-green hover:bg-gameflux-green/90 text-white font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
