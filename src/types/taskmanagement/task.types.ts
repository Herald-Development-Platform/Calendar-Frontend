export interface ITask {
  _id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  dueDate?: string
  invitedUsers?: User[]
  checklist?: ChecklistItem[]
  isArchived?: boolean
  isCompleted?: boolean
  createdBy?: User
  comments?: Comment[]
  createdAt?: string
  column: {
    _id: string;
    title: string;  
  };
  position: number;
}

export interface ChecklistItem {
  _id: string
  text: string
  isCompleted: boolean
}

export interface Comment {
  _id: string
  text: string
  author: User
  createdAt: string
}