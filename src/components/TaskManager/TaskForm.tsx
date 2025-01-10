import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ITask } from "@/types";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import useTaskStore from "@/store/useTaskStore";
import useDialogStore from "@/hooks/useDialog";

const TaskModalForm = () => {
  const { isOpen, task, closeDialog } = useDialogStore();
  const { updateTask } = useTaskStore();

  const [formData, setFormData] = useState<ITask | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [comment, setComment] = useState("");
  const [initialStatus, setInitialStatus] = useState("");

  // Sync formData with task when dialog opens or task changes
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        id: task.id,
        created_at: task.created_at || "",
        updated_at: task.updated_at || "",
        name: task.name || "",
        labels: task.labels || [],
        status: task.status || "OPEN",
        priority: task.priority || "LOW",
        assignee: task.assignee || "",
        due_date: task.due_date || "",
        comment: task.comment || "",
      });
      setComment(task.comment || "");
      setInitialStatus(task.status || "OPEN");
    }

    return () => {
      setShowConfirmation(false);
      setComment("");
    };
  }, [isOpen, task]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData!,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (formData?.status !== initialStatus) {
      setShowConfirmation(true);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (!formData) return;
    updateTask({
      ...formData,
      comment,
      updated_at: new Date().toISOString(),
    });
    setShowConfirmation(false);
    setComment("");
    closeDialog();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setComment("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent listening to keyboard events when typing in input fields
    const target = e.target as HTMLElement;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "1") {
      e.preventDefault();
      handleInputChange("status", "OPEN");
      handleSave();
    } else if (e.key === "2") {
      e.preventDefault();
      handleInputChange("status", "IN_PROGRESS");
      handleSave();
    } else if (e.key === "3") {
      e.preventDefault();
      handleInputChange("status", "CLOSED");
      handleSave();
    }
  };

  useEffect(() => {
    // Add event listener for arrow key navigation
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!formData) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent autoFocus className="max-w-3xl">
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update the task details below.</DialogDescription>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  autoFocus={false}
                />
              </div>

              <div>
                <Label htmlFor="labels">Labels</Label>
                <Input
                  id="labels"
                  value={formData?.labels?.join(",")}
                  onChange={(e) =>
                    handleInputChange("labels", e.target.value.split(","))
                  }
                  placeholder="e.g., frontend, backend"
                  autoFocus={false}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="BLOCKER">Blocker</SelectItem>
                    <SelectItem value="TRIVIAL">Trivial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) =>
                    handleInputChange("assignee", e.target.value)
                  }
                  placeholder="e.g., assignee26@company.com"
                />
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? (
                        format(new Date(formData.due_date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={
                        formData.due_date
                          ? new Date(formData.due_date)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleInputChange("due_date", date?.toISOString() || "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                disabled
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your changes..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={(e) => {
                  handleSave();
                }}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogTitle>Add Comment</AlertDialogTitle>
          <AlertDialogDescription>
            Please add a comment describing the changes made to this task.
          </AlertDialogDescription>

          <div className="my-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your changes..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              autoFocus
              onClick={handleConfirm}
              disabled={!comment.trim()}
            >
              Confirm Changes
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskModalForm;
