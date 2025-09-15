"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { useCreateTask } from "@/services/api/taskManagement/taskApi";

interface AddCardInputProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
}

export function AddCardInput({ onAdd, onCancel }: AddCardInputProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Don't close if there's content, just blur
        if (title.trim()) {
          inputRef.current?.blur();
        } else {
          onCancel();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [title, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <Card className=" mt-2 border-none p-0 shadow-none" ref={cardRef}>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            className="mb-2 h-9 rounded-md py-0 text-sm"
            autoFocus
          />
          <div className="flex gap-0.5">
            <Button type="submit" size="sm" className="font-light" disabled={!title.trim()}>
              Add card
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
