"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  MessageSquare,
  CheckSquare,
  Archive,
  Clock,
  User as UserIcon,
} from "lucide-react";
import {
  ChecklistItem,
  ITask,
  User,
  Comment,
} from "@/types/taskmanagement/task.types";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { UserAvatar } from "../user-avatar";
import { useQueryClient } from "@tanstack/react-query";

interface TaskDialogProps {
  openTaskDialog: boolean;
  setOpenTaskDialog: (open: boolean) => void;
  task?: ITask;

  // currentUser: User
  // availableUsers: User[]
}

export function TaskDialog({
  task,
  openTaskDialog,
  setOpenTaskDialog,
  // currentUser,
  // availableUsers
}: TaskDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<ITask>>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: undefined,
    },
  });

  const columnData: { data: ITaskColumnBase[] } | undefined =
    queryClient.getQueryData(["columns"]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
        assignee: task.assignee,
        
      });
      setChecklist(task.checklist || []);
      setComments(task.comments || []);
      //   const column = columns.find((col) => col.tasks.some((t) => t._id === task._id))
      //   setSelectedColumn(column?.id || "")
      setSelectedColumn(task.column._id)
    } else {
      reset();
      setChecklist([]);
      setComments([]);
      setSelectedColumn("");
    }
  }, [task, columnData, reset]);

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        {
          _id: Date.now().toString(),
          text: newChecklistItem.trim(),
          completed: false,
        },
      ]);
      setNewChecklistItem("");
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item._id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item._id !== id));
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        _id: Date.now().toString(),
        text: newComment.trim(),
        author: {
          _id: "currentUserId", // Replace with actual current user ID
          name: "Current User", // Replace with actual current user name
          email: "",
        },
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleAssigneeChange = (userId: string) => {
    if (userId === "unassigned") {
      setValue("assignee", undefined);
    } else {
      // const selectedUser = availableUsers.find((user) => user._id === userId)
      // if (selectedUser) {
      //   setValue("assignee", selectedUser)
      // }
    }
  };

  const onSubmit = (data: Partial<ITask>) => {
    if (!data.title?.trim()) return;
    const taskData: ITask = {
      _id: task?._id || Date.now().toString(),
      title: data.title,
      description: data.description,
      priority: data.priority || "medium",
      dueDate: data.dueDate,
      assignee: data.assignee,
      checklist,
      comments,
      createdBy: task?.createdBy || {
        _id: "currentUserId", // Replace with actual current user ID
        name: "Current User", // Replace with actual current user name
        email: "",
      },
      column: {
        _id: selectedColumn,
        title: columnData?.data.find((col) => col._id === selectedColumn)?.
          title || "Untitled Column",
      },
      // createdBy: task?.createdBy || currentUser,
      createdAt: task?.createdAt || new Date().toISOString(),
    };
    // onSave(taskData, selectedColumn)
    // onClose()
  };

  const handleDelete = () => {
    // if (task && onDelete) {
    //   onDelete(task._id)
    //   onClose()
    // }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const checklistProgress = checklist.length
    ? {
        completed: checklist.filter((i) => i.completed).length,
        total: checklist.length,
        percentage: Math.round(
          (checklist.filter((i) => i.completed).length / checklist.length) *
            100,
        ),
      }
    : null;

  return (
    <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Input
                {...register("title", { required: true })}
                className="h-auto border-none p-0 text-lg font-semibold focus-visible:ring-0"
                placeholder="Task title..."
              />
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>in list</span>
                <Select
                  value={selectedColumn}
                  onValueChange={setSelectedColumn}
                >
                  <SelectTrigger className="h-auto w-auto border-none bg-gray-100 p-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columnData?.data?.map((column) => (
                      <SelectItem key={column._id} value={column._id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-6"
        >
          <div className="col-span-2 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              {/* <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Add a more detailed description..."
                    className="min-h-[150px]"
                  />
                )}
              /> */}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <label className="text-sm font-semibold">Checklist</label>
                  {checklistProgress && (
                    <Badge variant="secondary" className="text-xs">
                      {checklistProgress.percentage}%
                    </Badge>
                  )}
                </div>
              </div>
              {checklistProgress && (
                <div className="mb-3">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: `${checklistProgress.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="mb-3 space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item._id}
                    className="group flex items-center gap-2 rounded p-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item._id)}
                      className="rounded"
                    />
                    <span
                      className={`flex-1 ${item.completed ? "text-muted-foreground line-through" : ""}`}
                    >
                      {item.text}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(item._id)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add an item..."
                  onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                />
                <Button type="button" onClick={addChecklistItem} size="sm">
                  Add
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <label className="text-sm font-semibold">Activity</label>
              </div>
              <div className="mb-4 space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    {/* <UserAvatar user={comment.author} size="sm" /> */}
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2 text-sm">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {/* <UserAvatar user={currentUser} size="sm" /> */}
                <div className="flex flex-1 gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    onKeyDown={(e) => e.key === "Enter" && addComment()}
                  />
                  <Button
                    onClick={addComment}
                    size="sm"
                    disabled={!newComment.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                DETAILS
              </label>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm">Priority</label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Due Date</label>
                  <Input type="date" {...register("dueDate")} className="h-8" />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Assignee</label>
                  <Select
                    value={watch("assignee")?._id || "unassigned"}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue>
                        {watch("assignee") ? (
                          <div className="flex items-center gap-2">
                            {/* <UserAvatar user={watch("assignee")!} size="sm" /> */}
                            <span className="text-sm">
                              {watch("assignee")!.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Unassigned
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Unassigned</span>
                        </div>
                      </SelectItem>
                      {/* {availableUsers.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          <div className="flex items-center gap-2">
                            <UserAvatar user={user} size="sm" />
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* <Separator /> */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                CREATED
              </label>
              <div className="space-y-2 text-sm">
                {task?.createdBy && (
                  <div className="flex items-center gap-2">
                    {/* <UserAvatar user={task.createdBy} size="sm" /> */}
                    <span>{task.createdBy.name}</span>
                  </div>
                )}
                {task?.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* <Separator /> */}

            <div className="space-y-2">
              <Button type="submit" className="w-full">
                {task ? "Save Changes" : "Create Task"}
              </Button>
              {task && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Delete Task
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
