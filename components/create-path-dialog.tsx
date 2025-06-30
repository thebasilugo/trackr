"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LearningPath } from "@/types"

interface CreatePathDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePath: (path: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => void
}

const PRESET_PATHS = [
  { name: "Web Development", icon: "💻", color: "#3B82F6", description: "Master modern web technologies" },
  { name: "Mobile Development", icon: "📱", color: "#EC4899", description: "Build native and cross-platform apps" },
  { name: "Data Science", icon: "📊", color: "#F59E0B", description: "Analyze data and build ML models" },
  { name: "Digital Marketing", icon: "📈", color: "#10B981", description: "Master online marketing strategies" },
  { name: "Photography", icon: "📸", color: "#8B5CF6", description: "Learn the art of visual storytelling" },
  { name: "Music Production", icon: "🎵", color: "#06B6D4", description: "Create and produce music" },
  { name: "Language Learning", icon: "🌍", color: "#84CC16", description: "Master a new language" },
  { name: "Fitness & Health", icon: "💪", color: "#EF4444", description: "Improve your physical wellbeing" },
]

const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899", "#84CC16"]

export function CreatePathDialog({ open, onOpenChange, onCreatePath }: CreatePathDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("📚")
  const [color, setColor] = useState("#3B82F6")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onCreatePath({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      videos: [],
    })

    // Reset form
    setName("")
    setDescription("")
    setIcon("📚")
    setColor("#3B82F6")
    onOpenChange(false)
  }

  const selectPreset = (preset: (typeof PRESET_PATHS)[0]) => {
    setName(preset.name)
    setDescription(preset.description)
    setIcon(preset.icon)
    setColor(preset.color)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Learning Path</DialogTitle>
          <DialogDescription>Set up a new learning path to organize your educational content.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preset Templates */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Templates</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PATHS.map((preset) => (
                <Button
                  key={preset.name}
                  type="button"
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() => selectPreset(preset)}
                >
                  <span className="mr-2">{preset.icon}</span>
                  <span className="text-sm">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Path Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Digital Photography Masterclass"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what you'll learn..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="📚"
                  maxLength={2}
                />
              </div>

              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {COLORS.map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === colorOption ? "border-slate-900" : "border-slate-300"
                      }`}
                      style={{ backgroundColor: colorOption }}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Path
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
