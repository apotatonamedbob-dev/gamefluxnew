import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  try {
    console.log("[v0] Admin users API: Starting request")

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check:", { user: user?.email, authError })

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = user.email === "josiahglanton@gmail.com"
    console.log("[v0] Admin check:", { email: user.email, isAdmin })

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("[v0] Query params:", { search, page, limit, offset })

    let query = supabase
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        is_admin,
        created_at,
        updated_at,
        bio,
        avatar_url
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`)
    }

    console.log("[v0] Executing profiles query...")
    const { data: users, error } = await query
    console.log("[v0] Profiles query result:", { users: users?.length, error })

    if (error) {
      console.error("[v0] Profiles query error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Executing count query...")
    let countQuery = supabase.from("profiles").select("*", { count: "exact", head: true })

    if (search) {
      countQuery = countQuery.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery
    console.log("[v0] Count query result:", { count, countError })

    if (countError) {
      console.error("[v0] Count query error:", countError)
      // Don't fail the request for count errors, just use 0
    }

    const response = {
      users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }

    console.log("[v0] Returning response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Admin users API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  // Check if user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isAdmin = user.email === "josiahglanton@gmail.com"

  if (!isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const { userId, is_admin } = await request.json()

  // Prevent removing admin status from owner
  const { data: targetUser } = await supabase.from("profiles").select("id").eq("id", userId).single()

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Check if target user is the owner (josiahglanton@gmail.com)
  const { data: authUser } = await supabase.auth.admin.getUserById(userId)
  if (authUser.user?.email === "josiahglanton@gmail.com" && !is_admin) {
    return NextResponse.json({ error: "Cannot remove admin status from owner" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_admin, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
