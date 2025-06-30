"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Clock, Play, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { LearningPath, Video } from "@/types"

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const [path, setPath] = useState<LearningPath | null>(null)
  const [video, setVideo] = useState<Video | null>(null)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")

  useEffect(() => {
    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      const paths: LearningPath[] = JSON.parse(savedPaths)
      const currentPath = paths.find((p) => p.id === params.pathId)
      if (currentPath) {
        setPath(currentPath)
        const currentVideo = currentPath.videos.find((v) => v.id === params.videoId)
        if (currentVideo) {
          setVideo(currentVideo)
          setEditedNotes(currentVideo.notes || "")
        } else {
          router.push(`/path/${params.pathId}`)
        }
      } else {
        router.push("/")
      }
    }
  }, [params.pathId, params.videoId, router])

  const updateVideoStatus = (status: Video["status"]) => {
    if (!path || !video) return

    const updatedVideos = path.videos.map((v) =>
      v.id === video.id
        ? {
            ...v,
            status,
            completedAt: status === "completed" ? new Date().toISOString() : undefined,
          }
        : v,
    )

    const updatedPath = {
      ...path,
      videos: updatedVideos,
      updatedAt: new Date().toISOString(),
    }

    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      const paths: LearningPath[] = JSON.parse(savedPaths)
      const updatedPaths = paths.map((p) => (p.id === updatedPath.id ? updatedPath : p))
      localStorage.setItem("trackr-paths", JSON.stringify(updatedPaths))
      setPath(updatedPath)
      setVideo({ ...video, status })
    }
  }

  const saveNotes = () => {
    if (!path || !video) return

    const updatedVideos = path.videos.map((v) =>
      v.id === video.id ? { ...v, notes: editedNotes.trim() || undefined } : v,
    )

    const updatedPath = {
      ...path,
      videos: updatedVideos,
      updatedAt: new Date().toISOString(),
    }

    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      const paths: LearningPath[] = JSON.parse(savedPaths)
      const updatedPaths = paths.map((p) => (p.id === updatedPath.id ? updatedPath : p))
      localStorage.setItem("trackr-paths", JSON.stringify(updatedPaths))
      setPath(updatedPath)
      setVideo({ ...video, notes: editedNotes.trim() || undefined })
    }

    setIsEditingNotes(false)
  }

  if (!path || !video) {
    return <div>Loading...</div>
  }

  const getEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push(`/path/${path.id}`)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {path.name}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src={getEmbedUrl(video.url)}
                    title={video.title}
                    className="w-full h-full rounded-t-lg"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">{video.title}</h1>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(video.status)}>
                          {getStatusIcon(video.status)}
                          <span className="ml-1">{video.status.replace("-", " ")}</span>
                        </Badge>
                        {video.tags &&
                          video.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      size="sm"
                      variant={video.status === "not-started" ? "default" : "outline"}
                      onClick={() => updateVideoStatus("not-started")}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Not Started
                    </Button>
                    <Button
                      size="sm"
                      variant={video.status === "in-progress" ? "default" : "outline"}
                      onClick={() => updateVideoStatus("in-progress")}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={video.status === "completed" ? "default" : "outline"}
                      onClick={() => updateVideoStatus("completed")}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Panel */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  {!isEditingNotes && (
                    <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(true)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add your notes about this video..."
                      rows={8}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveNotes}>
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingNotes(false)
                          setEditedNotes(video.notes || "")
                        }}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {video.notes ? (
                      <p className="text-slate-700 whitespace-pre-wrap">{video.notes}</p>
                    ) : (
                      <p className="text-slate-500 italic">
                        No notes yet. Click Edit to add your thoughts about this video.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">💡 Learning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <p>• Take notes while watching to reinforce learning</p>
                  <p>• Pause and practice what you learn</p>
                  <p>• Mark as "In Progress" when you start</p>
                  <p>• Only mark "Completed" when you understand the content</p>
                  <p>• Review your notes later to retain knowledge</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
