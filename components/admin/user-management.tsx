"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Shield, ShieldOff, Trash2, User, Crown } from "lucide-react"
import type { Profile } from "@/types/user"

interface UserWithEmail extends Profile {
  email?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<UserWithEmail[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [searchTerm, currentPage])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/admin/users?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=20`,
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching users:", response.status, errorText)
        return
      }

      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    setIsLoading(false)
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          is_admin: !currentStatus,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchUsers()
      } else {
        console.error("Error updating admin status:", data.error)
        alert(data.error || "Failed to update admin status")
      }
    } catch (error) {
      console.error("Error updating admin status:", error)
      alert("Failed to update admin status")
    }
  }

  const isOwner = (user: UserWithEmail) => {
    return user.email === "josiahglanton@gmail.com" || user.username === "josiahglanton"
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">User Management</CardTitle>
        <CardDescription className="text-gray-400">
          Manage user accounts and permissions • {users.length} users found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by username or display name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? `No users found matching "${searchTerm}"` : "No users found"}
          </div>
        ) : (
          <>
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Username</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-800">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium text-white flex items-center gap-2">
                              {user.display_name || "No name"}
                              {isOwner(user) && <Crown className="w-3 h-3 text-yellow-500" title="Owner" />}
                            </div>
                            <div className="text-sm text-gray-400">{user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">@{user.username || "no-username"}</TableCell>
                      <TableCell>
                        {isOwner(user) ? (
                          <Badge className="bg-yellow-600 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Owner
                          </Badge>
                        ) : user.is_admin ? (
                          <Badge className="bg-red-600 text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                            disabled={isOwner(user)}
                            className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              isOwner(user)
                                ? "Cannot modify owner permissions"
                                : user.is_admin
                                  ? "Remove admin"
                                  : "Make admin"
                            }
                          >
                            {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isOwner(user)}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isOwner(user) ? "Cannot delete owner" : "Delete user"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
