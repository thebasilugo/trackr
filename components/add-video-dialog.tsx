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
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Video } from "@/types"

interface AddVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddVideo: (video: Omit<Video, "id" | "addedAt">) => void
}

export function AddVideoDialog({ open, onOpenChange, onAddVideo }: AddVideoDialogProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const fetchVideoInfo = async (videoId: string) => {
    // In a real app, you'd use the YouTube API here
    // For now, we'll simulate the API response
    return new Promise<{ title: string; thumbnail: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          title: title || `Video ${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        })
      }, 1000)
    })
  }

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl)

    if (!newUrl.trim()) {
      setTitle("")
      return
    }

    const videoId = extractVideoId(newUrl)
    if (videoId) {
      setIsLoading(true)
      try {
        const videoInfo = await fetchVideoInfo(videoId)
        setTitle(videoInfo.title)
      } catch (error) {
        console.error("Failed to fetch video info:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) return

    const videoId = extractVideoId(url)
    if (!videoId) return

    onAddVideo({
      title: title.trim(),
      url: url.trim(),
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      status: "not-started",
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    })

    // Reset form
    setUrl("")
    setTitle("")
    setNotes("")
    setTags([])
    setNewTag("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add YouTube Video</DialogTitle>
          <DialogDescription>Add a YouTube video to your learning path and track your progress.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">YouTube URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isLoading ? "Fetching title..." : "Enter video title"}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this video..."
              rows={3}
            />
          </div>

          <div>
            <Label>Tags (Optional)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!url.trim() || !title.trim() || isLoading}>
              {isLoading ? "Loading..." : "Add Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
