export interface Profile {
  id: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  game_id: string
  created_at: string
}
