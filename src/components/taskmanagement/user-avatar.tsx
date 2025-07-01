"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Mail, UserIcon } from "lucide-react"
interface UserAvatarProps {
  user: User
  size?: "sm" | "md" | "lg"
  showPopover?: boolean
}

export function UserAvatar({ user, size = "md", showPopover = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const avatar = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.photo || "/placeholder.svg?height=32&width=32"} alt={user.username} />
      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
    </Avatar>
  )

  if (!showPopover) {
    return avatar
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full hover:ring-2 hover:ring-blue-200 transition-all">{avatar}</button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.photo || "/placeholder.svg?height=48&width=48"} alt={user.username} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{user.username}</h4>
            {user.role && (
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Team Member</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
