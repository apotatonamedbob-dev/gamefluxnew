"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Gamepad2 } from "lucide-react"

export function AdminStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gameflux-green" />
              User Growth
            </CardTitle>
            <CardDescription className="text-gray-400">User registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>Analytics dashboard coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2 text-gameflux-green" />
              Game Popularity
            </CardTitle>
            <CardDescription className="text-gray-400">Most played games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>Game analytics coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-gameflux-green" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">Latest user actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div>
                <p className="text-white text-sm">New user registration</p>
                <p className="text-gray-400 text-xs">user@example.com joined GAMEFLUX</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div>
                <p className="text-white text-sm">Game added to favorites</p>
                <p className="text-gray-400 text-xs">Shell Shockers favorited by user123</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white text-sm">Admin action</p>
                <p className="text-gray-400 text-xs">User permissions updated</p>
              </div>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
