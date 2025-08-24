import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { section, ...formData } = body

    // Handle different sections
    switch (section) {
      case "account":
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            username: formData.username,
            display_name: formData.displayName,
            bio: formData.bio,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (profileError) {
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
        }
        break

      case "security":
        if (formData.newPassword && formData.newPassword === formData.confirmPassword) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: formData.newPassword,
          })

          if (passwordError) {
            return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
          }
        }
        break

      case "privacy":
      case "notifications":
      case "appearance":
      case "preferences":
        // Store preferences in user_preferences table (would need to create this table)
        // For now, just return success
        break

      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
