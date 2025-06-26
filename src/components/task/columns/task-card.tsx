"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit2, Archive, CheckSquare } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "../user-avatar"
import { ITask } from "@/types/taskmanagement/task.types"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  dueDate?: string
  assignee?: User
  checklist?: ChecklistItem[]
  archived?: boolean
  completed?: boolean
  createdBy?: User
  comments?: Comment[]
  createdAt?: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Comment {
  id: string
  text: string
  author: User
  createdAt: string
}

interface TaskCardProps {
  task: ITask
  // onEdit: (task: Task) => void
  // onArchive: (taskId: string) => void
  // onToggleComplete: (taskId: string) => void
}

export function TaskCard({ task}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    let colorClass = "text-muted-foreground"
    if (task.completed) {
      colorClass = "text-green-600"
    } else if (diffDays < 0) {
      colorClass = "text-red-600"
    } else if (diffDays <= 2) {
      colorClass = "text-orange-600"
    }

    return { formatted, colorClass }
  }

  const checklistProgress = task.checklist
    ? {
        completed: task.checklist.filter((item) => item.completed).length,
        total: task.checklist.length,
      }
    : null

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing rounded py-0 hover:shadow-sm transition-shadow group ${isDragging ? "opacity-50" : ""} ${
        task.completed ? "opacity-60 bg-gray-50" : ""
      }`}
      // onClick={() => onEdit(task)}
    >
      <CardContent className="p-3 relative">
        <h3 className={`font-medium text-sm mb-2 ${task.completed ? "line-through text-gray-500" : ""}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{stripHtml(task.description)}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.priority && (
              <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            )}
            {checklistProgress && checklistProgress.total > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckSquare className="w-3 h-3" />
                <span className={checklistProgress.completed === checklistProgress.total ? "text-green-600" : ""}>
                  {checklistProgress.completed}/{checklistProgress.total}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className={formatDate(task.dueDate).colorClass}>{formatDate(task.dueDate).formatted}</span>
              </div>
            )}
            {task.assignee && <UserAvatar user={task.assignee} size="sm" showPopover />}
          </div>
        </div>

        {/* Hover Actions */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking buttons
        >
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              // onToggleComplete(task.id)
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                task.completed ? "bg-green-500 border-green-500" : "border-gray-400"
              }`}
            >
              {task.completed && <div className="text-white text-xs leading-none">✓</div>}
            </div>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              // onEdit(task)
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              // onArchive(task.id)
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Archive className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
