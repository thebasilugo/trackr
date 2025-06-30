"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, CheckCircle, Clock, MoreVertical, ExternalLink, Edit, Trash2, Save, X } from "lucide-react"
import Link from "next/link"
import type { Video } from "@/types"

interface VideoCardProps {
  video: Video
  index: number
  onStatusChange: (videoId: string, status: Video["status"]) => void
  onDelete: (videoId: string) => void
  pathId: string
}

export function VideoCard({ video, index, onStatusChange, onDelete, pathId }: VideoCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editedNotes, setEditedNotes] = useState(video.notes || "")

  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in-progress":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-slate-400 bg-slate-50"
    }
  }

  const getStatusIcon = (status: Video["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const handleSaveNotes = () => {
    // In a real app, you'd update the video notes here
    setIsEditingNotes(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Video Thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className={`absolute top-2 left-2 p-1 rounded-full ${getStatusColor(video.status)}`}>
                {getStatusIcon(video.status)}
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate mb-1">
                  {index + 1}. {video.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getStatusColor(video.status)}>
                    {video.status.replace("-", " ")}
                  </Badge>
                  {video.tags &&
                    video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange(video.id, "not-started")}>
                    <Play className="w-4 h-4 mr-2" />
                    Mark as Not Started
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(video.id, "in-progress")}>
                    <Clock className="w-4 h-4 mr-2" />
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(video.id, "completed")}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditingNotes(!isEditingNotes)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(video.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notes Section */}
            {isEditingNotes ? (
              <div className="mb-3">
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add your notes about this video..."
                  rows={3}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(false)}>
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              video.notes && (
                <div className="mb-3">
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{video.notes}</p>
                </div>
              )
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link href={`/watch/${pathId}/${video.id}`}>
                <Button size="sm">
                  <Play className="w-3 h-3 mr-1" />
                  Watch
                </Button>
              </Link>
              <Button size="sm" variant="outline" asChild>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  YouTube
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
