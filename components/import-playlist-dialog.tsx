"use client"

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
import { useToast } from "@/hooks/use-toast"
import type { Video } from "@/types"

interface ImportPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportPlaylist: (data: { name: string; videos: Video[] }) => void
}

export function ImportPlaylistDialog({ open, onOpenChange, onImportPlaylist }: ImportPlaylistDialogProps) {
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const extractPlaylistId = (url: string) => {
    const regex = /[?&]list=([^#&?]*)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const mockFetchPlaylistData = async (playlistId: string) => {
    // In a real app, you'd use the YouTube API here
    // For demo purposes, we'll simulate fetching playlist data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockVideos: Video[] = [
      {
        id: "1",
        title: "Introduction to the Course",
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        status: "not-started",
        addedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Getting Started with Basics",
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        status: "not-started",
        addedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Advanced Concepts Explained",
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        status: "not-started",
        addedAt: new Date().toISOString(),
      },
    ]

    return {
      name: "Sample Learning Playlist",
      videos: mockVideos,
    }
  }

  const handleImport = async () => {
    if (!playlistUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube playlist URL.",
        variant: "destructive",
      })
      return
    }

    const playlistId = extractPlaylistId(playlistUrl)
    if (!playlistId) {
      toast({
        title: "Error",
        description: "Invalid YouTube playlist URL. Please check the URL and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const playlistData = await mockFetchPlaylistData(playlistId)
      onImportPlaylist(playlistData)

      toast({
        title: "Success",
        description: `Imported ${playlistData.videos.length} videos from the playlist.`,
      })

      setPlaylistUrl("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import playlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import YouTube Playlist</DialogTitle>
          <DialogDescription>
            Import an entire YouTube playlist as a learning path. All videos will be added automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="playlist-url">YouTube Playlist URL</Label>
            <Input
              id="playlist-url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              disabled={isLoading}
            />
            <p className="text-sm text-slate-500 mt-1">Paste the URL of a YouTube playlist to import all videos</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to get a playlist URL:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to YouTube and find the playlist you want to import</li>
              <li>2. Copy the URL from your browser's address bar</li>
              <li>3. Paste it above and click "Import Playlist"</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!playlistUrl.trim() || isLoading}>
            {isLoading ? "Importing..." : "Import Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
