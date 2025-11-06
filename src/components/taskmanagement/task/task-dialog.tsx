"use client";

import { useContext, useEffect, useState, useRef } from "react";
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
  Calendar,
  Flag,
  Users,
  Plus,
  Edit3,
  Trash2,
  Send,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ChecklistItem, ITask, Comment } from "@/types/taskmanagement/task.types";
import { ITaskColumnBase } from "@/types/taskmanagement/column.types";
import { UserAvatar } from "../user-avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { Axios } from "@/services/baseUrl";
import { useUpdateTask } from "@/services/api/taskManagement/taskApi";
import toast from "react-hot-toast";
import { useGetColumns } from "@/services/api/taskManagement/columnsApi";

interface TaskDialogProps {
  openTaskDialog: boolean;
  setOpenTaskDialog: (open: boolean) => void;
  task: ITask;
  disableEditDelete?: boolean;
}

const formatDateTimeLocal = (date: string) => {
  if (!date || date.trim() === "") return "";
  const d = new Date(date);
  // Check if date is valid
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function TaskDialog({
  task,
  openTaskDialog,
  setOpenTaskDialog,
  disableEditDelete,
}: TaskDialogProps) {
  const queryClient = useQueryClient();
  const { userData } = useContext(Context);

  // API CALLS
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<Omit<ITask, "column"> & { column: string }>>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      invitedUsers: [],
      column: "",
    },
  });

  const { data: columnData, isLoading: isColumnsLoading } = useGetColumns();

  const { data: allUsers, isLoading: allUsersLoading } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => Axios.get("/profile/all"),
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: formatDateTimeLocal(task.dueDate || ""),
        invitedUsers: task.invitedUsers || [],
        column: task.column._id,
      });
      setChecklist(task.checklist || []);
      setComments(task.comments || []);
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        invitedUsers: [],
        column: "",
      });
      setChecklist([]);
      setComments([]);
    }
  }, [task, columnData, reset]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        {
          _id: Date.now().toString(),
          text: newChecklistItem.trim(),
          isCompleted: false,
        },
      ]);
      setNewChecklistItem("");
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map(item => (item._id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item._id !== id));
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        _id: Date.now().toString(),
        text: newComment.trim(),
        author: userData as User,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const onSubmit = (data: Partial<Omit<ITask, "column"> & { column: string }>) => {
    console.log("Form submission data:", data);

    if (!data.title?.trim()) {
      toast.error("Task title is required");
      return;
    }

    const selectedColumnObj = columnData?.data?.find(
      (col: ITaskColumnBase) => col._id === data.column
    );
    if (!selectedColumnObj && !disableEditDelete) {
      toast.error("Please select a valid column");
      return;
    }

    const oldColumnId = task?.column?._id;
    const newColumnId = data.column;

    // Clean up the due date - ensure it's either a valid date string or undefined
    let cleanDueDate = data.dueDate;
    if (cleanDueDate && cleanDueDate.trim() === "") {
      cleanDueDate = undefined;
    }

    // Create updated task - conditionally include only necessary fields for invited tasks
    const updatedTask = disableEditDelete
      ? {
          _id: task._id,
          isCompleted: task.isCompleted,
          checklist: checklist,
        }
      : {
          ...task,
          title: data.title,
          description: data.description,
          dueDate: cleanDueDate,
          priority: data.priority || "medium",
          column: selectedColumnObj,
          invitedUsers: data.invitedUsers,
          checklist: checklist,
          comments: comments,
        };

    const queryKey = disableEditDelete ? ["invited-tasks"] : ["tasks", oldColumnId];
    const oldQueryKey = ["tasks", oldColumnId];
    const newQueryKey = ["tasks", newColumnId];

    if (disableEditDelete) {
      // For invited tasks, just update the cache and call API
      const invitedTasks: { data: ITask[] } | undefined = queryClient.getQueryData(queryKey);
      const previousTasks = invitedTasks?.data || [];

      // Optimistic update for invited tasks
      const updatedTasks = previousTasks.map(t =>
        t._id === task._id ? { ...t, isCompleted: task.isCompleted, checklist: checklist } : t
      );
      queryClient.setQueryData(queryKey, { data: updatedTasks });

      // Call API
      updateTask(updatedTask, {
        onSuccess: () => {
          toast.success("Task updated successfully");
        },
        onError: error => {
          toast.error("Failed to update task");
          // Rollback
          queryClient.setQueryData(queryKey, { data: previousTasks });
        },
      });
    } else {
      // Original logic for regular tasks
      // Get old and new column data
      const oldColumnTasks: { data: ITask[] } | undefined = queryClient.getQueryData(oldQueryKey);
      const newColumnTasks: { data: ITask[] } | undefined = queryClient.getQueryData(newQueryKey);

      const previousOldTasks = oldColumnTasks?.data || [];
      const previousNewTasks = newColumnTasks?.data || [];

      // Prepare optimistic update
      if (oldColumnId === newColumnId) {
        // Just update task in the same column
        const updatedTasks = previousOldTasks.map(t => (t._id === task._id ? updatedTask : t));
        queryClient.setQueryData(oldQueryKey, { data: updatedTasks });
      } else {
        // Remove from old column
        const updatedOldTasks = previousOldTasks.filter(t => t._id !== task._id);
        queryClient.setQueryData(oldQueryKey, { data: updatedOldTasks });

        // Add to new column
        queryClient.setQueryData(newQueryKey, {
          data: [...previousNewTasks, updatedTask],
        });
      }

      // Call API
      updateTask(updatedTask, {
        onSuccess: () => {
          toast.success("Task updated successfully");
        },
        onError: error => {
          toast.error("Failed to update task");

          // Rollback
          queryClient.setQueryData(oldQueryKey, { data: previousOldTasks });
          if (oldColumnId !== newColumnId) {
            queryClient.setQueryData(newQueryKey, { data: previousNewTasks });
          }
        },
      });
    }
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
        isCompleted: checklist.filter(i => i.isCompleted).length,
        total: checklist.length,
        percentage: Math.round(
          (checklist.filter(i => i.isCompleted).length / checklist.length) * 100
        ),
      }
    : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3" />;
      case "medium":
        return <Flag className="h-3 w-3" />;
      case "low":
        return <CheckCircle2 className="h-3 w-3" />;
      default:
        return <Flag className="h-3 w-3" />;
    }
  };

  const isDueSoon = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-[#ed9200]",
    high: "bg-[#ae2e24]",
  };

  return (
    <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
      <DialogContent className="max-h-[95vh] overflow-y-auto bg-[#fcfcfd] p-0 sm:max-w-[900px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
          {/* Header */}
          <div className="rounded-t-lg border-b bg-[#fcfcfd] px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      readOnly={disableEditDelete}
                      className="h-auto border-none bg-transparent p-0 text-lg font-medium text-black/70 placeholder:text-gray-400 focus-visible:ring-0"
                      placeholder="Task title..."
                    />
                  )}
                />
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    {!disableEditDelete && (
                      <>
                        <span className="text-xs">in</span>
                        <Controller
                          name="column"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              value={typeof field.value === "string" ? field.value : ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="hover:bg-theme/80 h-auto w-auto rounded-sm border-none bg-theme px-2 py-0.5 text-[11px] font-light text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {columnData?.data?.map((column: ITaskColumnBase) => (
                                  <SelectItem key={column._id} value={column._id}>
                                    {column.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </>
                    )}
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => {
                        const priority = field.value || "medium";
                        if (priority !== "low") {
                          return (
                            <Badge
                              variant="secondary"
                              className={`rounded-sm px-1 py-0 text-[10px] font-light capitalize text-white hover:${priorityColors[priority as keyof typeof priorityColors]} ${
                                priorityColors[priority as keyof typeof priorityColors]
                              }`}
                            >
                              {priority} Priority
                            </Badge>
                          );
                        }
                        return <span></span>;
                      }}
                    />
                    {watch("dueDate") && (
                      <div className="flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(watch("dueDate") || "").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {checklistProgress && checklistProgress.total > 0 && (
                      <div className="flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
                        <CheckSquare className="h-3 w-3" />
                        <span>
                          {checklistProgress.isCompleted}/{checklistProgress.total}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick indicators */}
                  <div className="flex items-center gap-1">
                    {/* Action Buttons */}
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        type="submit"
                        size="sm"
                        className="hover:bg-theme/80 h-6 bg-theme px-2 text-[11px] font-light text-white"
                        disabled={isUpdatingTask}
                      >
                        {isUpdatingTask ? "Saving..." : "Save Changes"}
                      </Button>
                      {task && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDelete}
                          className="h-6 w-6 border-red-200 p-0 text-red-600 hover:bg-red-50"
                          title="Delete Task"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenTaskDialog(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden bg-[#fcfcfd]">
            {/* Main Content */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {/* Description */}
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-black/70">
                    <Edit3 className="h-4 w-4" />
                    Description
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    {isEditingDescription ? "Save" : "Edit"}
                  </Button>
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) =>
                    isEditingDescription ? (
                      <textarea
                        {...field}
                        className="focus:ring-theme/20 min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-theme focus:outline-none focus:ring-2"
                        placeholder="Add a detailed description..."
                        onBlur={() => setIsEditingDescription(false)}
                        readOnly={disableEditDelete}
                        autoFocus
                      />
                    ) : (
                      <div
                        className="min-h-[60px] w-full cursor-text rounded-lg border border-gray-100 bg-[#fcfcfd] px-3 py-2 text-sm text-black/70 transition-colors hover:bg-gray-50"
                        onClick={() => setIsEditingDescription(true)}
                      >
                        {field.value || "Click to add a description..."}
                      </div>
                    )
                  }
                />
              </div>

              {/* Checklist */}
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                <ChecklistSection
                  checklist={checklist}
                  setChecklist={setChecklist}
                  newChecklistItem={newChecklistItem}
                  setNewChecklistItem={setNewChecklistItem}
                />
              </div>

              {/* Comments */}
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                <CommentsSection
                  comments={comments}
                  setComments={setComments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  userData={userData}
                  formatDate={formatDate}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-4 border-l bg-[#fcfcfd] p-6">
              {/* Tabs */}
              <div className="flex rounded-lg border border-gray-100 bg-white p-1 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "details"
                      ? "bg-theme text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "activity"
                      ? "bg-theme text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("activity")}
                >
                  Activity
                </button>
              </div>

              {activeTab === "details" ? (
                <div className="space-y-4">
                  {/* Priority */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black/70">
                      <Flag className="h-4 w-4" />
                      Priority
                    </label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-10 border-gray-200 bg-[#fcfcfd]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Low
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-yellow-500" />
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                High
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Due Date */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black/70">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </label>
                    <Input
                      type="datetime-local"
                      {...register("dueDate")}
                      className="h-10 border-gray-200 bg-[#fcfcfd]"
                    />
                  </div>

                  {/* Invited Users */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black/70">
                      <Users className="h-4 w-4" />
                      Assignees
                    </label>
                    <Controller
                      name="invitedUsers"
                      control={control}
                      render={({ field }) => {
                        const selectedUsers: User[] = field.value || [];
                        return (
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              className="focus:ring-theme/20 flex min-h-[40px] w-full flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-[#fcfcfd] px-2 py-2 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                              {selectedUsers.length === 0 ? (
                                <span className="text-sm text-gray-500">Select users...</span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {selectedUsers.map(user => (
                                    <div
                                      key={user._id}
                                      className="flex items-center gap-1 rounded-full bg-theme px-1 py-1 text-[11px] font-light text-white"
                                    >
                                      <UserAvatar user={user} size="sm" />
                                      {user.username}
                                      <button
                                        type="button"
                                        className="ml-1 text-white hover:text-red-200"
                                        onClick={e => {
                                          e.stopPropagation();
                                          field.onChange(
                                            selectedUsers.filter(u => u._id !== user._id)
                                          );
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </button>
                            {dropdownOpen && (
                              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                                {allUsers?.data?.data.map((user: User) => (
                                  <div
                                    key={user._id}
                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50"
                                    onClick={() => {
                                      const isSelected = selectedUsers.some(
                                        u => u._id === user._id
                                      );
                                      if (isSelected) {
                                        field.onChange(
                                          selectedUsers.filter(u => u._id !== user._id)
                                        );
                                      } else {
                                        field.onChange([...selectedUsers, user]);
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedUsers.some(u => u._id === user._id)}
                                      readOnly
                                      className="rounded text-theme"
                                    />
                                    <UserAvatar user={user} size="sm" />
                                    <span className="text-sm">{user.username}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  {/* Creation Info */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                    <h4 className="mb-3 text-sm font-medium text-black/70">Created</h4>
                    {task?.createdBy && (
                      <div className="mb-2 flex items-center gap-2">
                        <UserAvatar user={task.createdBy} size="sm" />
                        <span className="text-sm text-gray-600">{task.createdBy.username}</span>
                      </div>
                    )}
                    {task?.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(task.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1.6px_8px_rgba(0,0,0,0.03)]">
                  <h4 className="mb-4 text-sm font-medium text-black/70">Recent Activity</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-theme"></div>
                      <span>Task created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-theme"></div>
                      <span>Priority updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span>Due date set</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Enhanced Checklist Section
function ChecklistSection({
  checklist,
  setChecklist,
  newChecklistItem,
  setNewChecklistItem,
}: {
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  newChecklistItem: string;
  setNewChecklistItem: React.Dispatch<React.SetStateAction<string>>;
}) {
  const checklistProgress = checklist.length
    ? {
        isCompleted: checklist.filter(i => i.isCompleted).length,
        total: checklist.length,
        percentage: Math.round(
          (checklist.filter(i => i.isCompleted).length / checklist.length) * 100
        ),
      }
    : null;

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        {
          _id: Date.now().toString(),
          text: newChecklistItem.trim(),
          isCompleted: false,
        },
      ]);
      setNewChecklistItem("");
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map(item => (item._id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-black/70">
          <CheckSquare className="h-4 w-4" />
          Checklist
          {checklistProgress && (
            <div className="ml-2 flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
              {checklistProgress.percentage}%
            </div>
          )}
        </h3>
      </div>

      {checklistProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              {checklistProgress.isCompleted} of {checklistProgress.total} complete
            </span>
            <span>{checklistProgress.percentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-theme transition-all duration-300"
              style={{ width: `${checklistProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {checklist.map(item => (
          <div
            key={item._id}
            className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-[#fcfcfd] px-3 py-2 transition-colors hover:bg-gray-50"
          >
            <button
              type="button"
              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                item.isCompleted
                  ? "border-theme bg-theme text-white"
                  : "border-gray-300 hover:border-theme"
              }`}
              onClick={() => toggleChecklistItem(item._id)}
            >
              {item.isCompleted && <Check className="h-3 w-3" />}
            </button>
            <span
              className={`flex-1 text-sm transition-colors ${
                item.isCompleted ? "text-gray-500 line-through" : "text-black/70"
              }`}
            >
              {item.text}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeChecklistItem(item._id)}
              className="h-6 w-6 p-0 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={newChecklistItem}
            onChange={e => setNewChecklistItem(e.target.value)}
            placeholder="Add an item..."
            className="h-10 border-gray-200 bg-[#fcfcfd]"
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                addChecklistItem();
              }
            }}
          />
        </div>
        <Button
          type="button"
          onClick={addChecklistItem}
          size="sm"
          className="hover:bg-theme/80 bg-theme px-4 font-light text-white"
          disabled={!newChecklistItem.trim()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}

// Enhanced Comments Section
function CommentsSection({
  comments,
  setComments,
  newComment,
  setNewComment,
  userData,
  formatDate,
}: {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  userData: any;
  formatDate: (dateString: string) => string;
}) {
  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        _id: Date.now().toString(),
        text: newComment.trim(),
        author: userData as User,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-medium text-black/70">
        <MessageSquare className="h-4 w-4" />
        Activity
        {comments.length > 0 && (
          <div className="ml-2 flex items-center gap-1 rounded-sm bg-theme px-1 py-0.5 text-[11px] font-light text-white">
            {comments.length}
          </div>
        )}
      </h3>

      {/* Comments List */}
      <div className="max-h-80 space-y-4 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="group flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar user={comment.author} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-black/70">
                    {comment.author.username}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="rounded-lg border border-gray-100 bg-[#fcfcfd] px-3 py-2">
                  <p className="whitespace-pre-wrap text-sm text-black/70">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-3 border-t pt-4">
        <div className="flex-shrink-0">
          <UserAvatar user={userData as User} size="sm" />
        </div>
        <div className="flex-1 space-y-2">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="focus:ring-theme/20 min-h-[80px] w-full resize-none rounded-lg border border-gray-200 bg-[#fcfcfd] px-3 py-2 text-sm placeholder:text-gray-400 focus:border-theme focus:outline-none focus:ring-2"
            onKeyDown={e => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Press Cmd/Ctrl + Enter to send</span>
            <Button
              type="button"
              onClick={addComment}
              size="sm"
              disabled={!newComment.trim()}
              className="hover:bg-theme/80 bg-theme font-light text-white"
            >
              <Send className="mr-1 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
