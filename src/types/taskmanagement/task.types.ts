export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface ITask {
  _id: string
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
  column: {
    _id: string;
    title: string;  
  };
}

export interface ChecklistItem {
  _id: string
  text: string
  completed: boolean
}

export interface Comment {
  _id: string
  text: string
  author: User
  createdAt: string
}