"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function InputDialog({
  open,
  onOpenChange,
  title = "Enter Input",
  description = "Please provide the required information.",
  label = "Input",
  placeholder = "",
  required = false,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}) {
  const [value, setValue] = useState("");

  const handleConfirm = () => {
    if (required && !value.trim()) return;
    onConfirm?.(value);
    setValue("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setValue("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setValue("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
          <DialogDescription className="text-blue-700">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-blue-800">{label}</Label>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="border-blue-300 focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={required && !value.trim()}
            variant={variant === "destructive" ? "destructive" : "default"}
            className={variant === "destructive" ? "" : "bg-blue-600 hover:bg-blue-700"}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}