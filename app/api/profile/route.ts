import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[v0] Profile GET - User:", user?.email, "Auth Error:", authError)

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  console.log("[v0] Profile GET - Profile data:", profile, "Error:", error)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user, profile })
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[v0] Profile PUT - User:", user?.email, "Auth Error:", authError)

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  console.log("[v0] Profile PUT - Request body:", body)

  const updateData = {
    id: user.id,
    username: body.username?.trim() || null,
    display_name: body.display_name?.trim() || null,
    bio: body.bio?.trim() || null,
    avatar_url: body.avatar_url || null,
    updated_at: new Date().toISOString(),
  }

  console.log("[v0] Profile PUT - Update data:", updateData)

  const { data, error } = await supabase
    .from("profiles")
    .upsert(updateData, {
      onConflict: "id",
    })
    .select()

  console.log("[v0] Profile PUT - Result data:", data, "Error:", error)

  if (error) {
    console.log("[v0] Profile PUT - Detailed error:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, profile: data?.[0] })
}
