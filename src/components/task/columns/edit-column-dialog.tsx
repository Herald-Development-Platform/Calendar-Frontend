"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ITaskColumnBase } from "@/types/taskmanagement/column.types"

interface EditColumnDialogProps {
  column?: ITaskColumnBase
  isOpen: boolean
  onClose: () => void
  onSave: (columnId: string, title: string) => void
}

export function EditColumnDialog({ column, isOpen, onClose, onSave }: EditColumnDialogProps) {
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (column) {
      setTitle(column.title)
    }
  }, [column])

  const handleSave = () => {
    if (!title.trim() || !column) return
    onSave(column._id, title.trim())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="columnTitle">Column Title</label>
            <Input
              id="columnTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title..."
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
