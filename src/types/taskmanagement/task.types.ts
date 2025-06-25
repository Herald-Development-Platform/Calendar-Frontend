export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface ITask {
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