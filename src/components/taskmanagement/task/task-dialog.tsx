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
} from "lucide-react";
import {
  ChecklistItem,
  ITask,
  Comment,
} from "@/types/taskmanagement/task.types";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
        author: userData as User,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleInvitedUsersChange = (userIds: string[]) => {
    const selectedUsers =
      allUsers?.data?.data?.filter((user: User) =>
        userIds.includes(user._id),
      ) || [];
    setValue("invitedUsers", selectedUsers);
  };

  const onSubmit = (
    data: Partial<Omit<ITask, "column"> & { column: string }>,
  ) => {
    if (!data.title?.trim()) return;

    const selectedColumnObj = columnData?.data?.find(
      (col: ITaskColumnBase) => col._id === data.column,
    );
    if (!selectedColumnObj) return;

    const oldColumnId = task?.column?._id;
    const newColumnId = data.column;

    const updatedTask: ITask = {
      ...task,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority || "medium",
      column: selectedColumnObj,
      invitedUsers: data.invitedUsers,
    };

    const oldQueryKey = ["tasks", oldColumnId];
    const newQueryKey = ["tasks", newColumnId];

    // Get old and new column data
    const oldColumnTasks: { data: ITask[] } | undefined =
      queryClient.getQueryData(oldQueryKey);
    const newColumnTasks: { data: ITask[] } | undefined =
      queryClient.getQueryData(newQueryKey);

    const previousOldTasks = oldColumnTasks?.data || [];
    const previousNewTasks = newColumnTasks?.data || [];

    // Prepare optimistic update
    if (oldColumnId === newColumnId) {
      // Just update task in the same column
      const updatedTasks = previousOldTasks.map((t) =>
        t._id === task._id ? updatedTask : t,
      );
      queryClient.setQueryData(oldQueryKey, { data: updatedTasks });
    } else {
      // Remove from old column
      const updatedOldTasks = previousOldTasks.filter(
        (t) => t._id !== task._id,
      );
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
      onError: (error) => {
        toast.error("Failed to update task");

        // Rollback
        queryClient.setQueryData(oldQueryKey, { data: previousOldTasks });
        if (oldColumnId !== newColumnId) {
          queryClient.setQueryData(newQueryKey, { data: previousNewTasks });
        }
      },
    });
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

  // Helper for toggling users
  const toggleUser = (
    selectedUsers: User[],
    user: User,
    onChange: (users: User[]) => void,
  ) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      onChange(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      onChange([...selectedUsers, user]);
    }
  };

  return (
    <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="h-auto border-none p-0 text-lg font-semibold focus-visible:ring-0"
                    placeholder="Task title..."
                  />
                )}
              />
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>in list</span>
                <Controller
                  name="column"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={typeof field.value === "string" ? field.value : ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-auto w-auto border-none bg-gray-100 p-1">
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
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="min-h-[80px] w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Add a more detailed description..."
                  />
                )}
              />
            </div>

            <ChecklistSection
              checklist={checklist}
              setChecklist={setChecklist}
              newChecklistItem={newChecklistItem}
              setNewChecklistItem={setNewChecklistItem}
            />

            <CommentsSection
              comments={comments}
              setComments={setComments}
              newComment={newComment}
              setNewComment={setNewComment}
              userData={userData}
              formatDate={formatDate}
            />
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
                  <label className="mb-1 block text-sm">Invited Users</label>
                  <Controller
                    name="invitedUsers"
                    control={control}
                    render={({ field }) => {
                      const selectedUsers: User[] = field.value || [];
                      return (
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            className={`flex min-h-[40px] w-full flex-wrap items-center gap-1 rounded border bg-white px-2 py-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/50 ${dropdownOpen ? "ring-2 ring-primary/50" : ""}`}
                            onClick={() => setDropdownOpen((v) => !v)}
                            tabIndex={0}
                            aria-haspopup="listbox"
                            aria-expanded={dropdownOpen}
                          >
                            {selectedUsers.length === 0 && (
                              <span className="text-sm text-muted-foreground">
                                Select users...
                              </span>
                            )}
                            {selectedUsers.map((user) => (
                              <span
                                key={user._id}
                                className="mr-1 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                              >
                                <UserAvatar user={user} size="sm" />
                                {user.username}
                                <button
                                  type="button"
                                  className="ml-1 text-xs text-gray-400 hover:text-red-500 focus:outline-none"
                                  tabIndex={-1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      selectedUsers.filter(
                                        (u) => u._id !== user._id,
                                      ),
                                    );
                                  }}
                                  aria-label={`Remove ${user.username}`}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            <span
                              className={`ml-auto transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            >
                              <svg
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 9l6 6 6-6"
                                />
                              </svg>
                            </span>
                          </button>
                          {dropdownOpen && (
                            <div className="animate-fade-in absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow">
                              {allUsers?.data?.data.map((user: User) => (
                                <div
                                  key={user._id}
                                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors ${selectedUsers.some((u) => u._id === user._id) ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleUser(
                                      selectedUsers,
                                      user,
                                      field.onChange,
                                    );
                                    setDropdownOpen(false);
                                  }}
                                  role="option"
                                  aria-selected={selectedUsers.some(
                                    (u) => u._id === user._id,
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.some(
                                      (u) => u._id === user._id,
                                    )}
                                    readOnly
                                    className="accent-primary"
                                  />
                                  <UserAvatar user={user} size="sm" />
                                  <span className="text-sm">
                                    {user.username}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
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
                    <UserAvatar user={task.createdBy} size="sm" />
                    <span>{task.createdBy.username}</span>
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

// Checklist Section
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
        completed: checklist.filter((i) => i.completed).length,
        total: checklist.length,
        percentage: Math.round(
          (checklist.filter((i) => i.completed).length / checklist.length) *
            100,
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

  return (
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
  );
}

// Comments Section
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
                  {comment.author.username}
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
        <UserAvatar user={userData as User} size="sm" />
        <div className="flex flex-1 gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />
          <Button onClick={addComment} size="sm" disabled={!newComment.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
