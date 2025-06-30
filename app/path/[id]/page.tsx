"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Play, CheckCircle, Clock, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { LearningPath, Video } from "@/types"
import { AddVideoDialog } from "@/components/add-video-dialog"
import { VideoCard } from "@/components/video-card"

export default function PathPage() {
  const params = useParams()
  const router = useRouter()
  const [path, setPath] = useState<LearningPath | null>(null)
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "not-started" | "in-progress" | "completed">("all")

  useEffect(() => {
    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      const paths: LearningPath[] = JSON.parse(savedPaths)
      const currentPath = paths.find((p) => p.id === params.id)
      if (currentPath) {
        setPath(currentPath)
      } else {
        router.push("/")
      }
    }
  }, [params.id, router])

  const updatePath = (updatedPath: LearningPath) => {
    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      const paths: LearningPath[] = JSON.parse(savedPaths)
      const updatedPaths = paths.map((p) => (p.id === updatedPath.id ? updatedPath : p))
      localStorage.setItem("trackr-paths", JSON.stringify(updatedPaths))
      setPath(updatedPath)
    }
  }

  const handleAddVideo = (videoData: Omit<Video, "id" | "addedAt">) => {
    if (!path) return

    const newVideo: Video = {
      ...videoData,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    }

    const updatedPath = {
      ...path,
      videos: [...path.videos, newVideo],
      updatedAt: new Date().toISOString(),
    }

    updatePath(updatedPath)
  }

  const handleVideoStatusChange = (videoId: string, status: Video["status"]) => {
    if (!path) return

    const updatedVideos = path.videos.map((video) =>
      video.id === videoId
        ? {
            ...video,
            status,
            completedAt: status === "completed" ? new Date().toISOString() : undefined,
          }
        : video,
    )

    const updatedPath = {
      ...path,
      videos: updatedVideos,
      updatedAt: new Date().toISOString(),
    }

    updatePath(updatedPath)
  }

  const handleDeleteVideo = (videoId: string) => {
    if (!path) return

    const updatedPath = {
      ...path,
      videos: path.videos.filter((video) => video.id !== videoId),
      updatedAt: new Date().toISOString(),
    }

    updatePath(updatedPath)
  }

  if (!path) {
    return <div>Loading...</div>
  }

  const getProgress = () => {
    if (path.videos.length === 0) return 0
    const completedVideos = path.videos.filter((video) => video.status === "completed").length
    return Math.round((completedVideos / path.videos.length) * 100)
  }

  const filteredVideos = path.videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: Video["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Play className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusCount = (status: Video["status"]) => {
    return path.videos.filter((video) => video.status === status).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{path.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{path.name}</h1>
                <p className="text-slate-600">{path.description}</p>
              </div>
            </div>
            <Button onClick={() => setShowAddVideo(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </div>

          {/* Progress Overview */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{getProgress()}%</span>
                  </div>
                  <Progress value={getProgress()} className="h-3" />
                </div>

                <div className="flex items-center">
                  <Play className="w-5 h-5 text-slate-400 mr-2" />
                  <div>
                    <p className="text-lg font-semibold">{getStatusCount("not-started")}</p>
                    <p className="text-sm text-slate-600">Not Started</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-lg font-semibold">{getStatusCount("in-progress")}</p>
                    <p className="text-sm text-slate-600">In Progress</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-lg font-semibold">{getStatusCount("completed")}</p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter: {statusFilter === "all" ? "All" : statusFilter.replace("-", " ")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Videos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("not-started")}>Not Started</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          {filteredVideos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Play className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {path.videos.length === 0 ? "No videos yet" : "No videos match your search"}
                </p>
                <p className="text-sm text-center mb-4">
                  {path.videos.length === 0
                    ? "Start building your learning path by adding YouTube videos"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {path.videos.length === 0 && (
                  <Button onClick={() => setShowAddVideo(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Video
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onStatusChange={handleVideoStatusChange}
                onDelete={handleDeleteVideo}
                pathId={path.id}
              />
            ))
          )}
        </div>

        {/* Add Video Dialog */}
        <AddVideoDialog open={showAddVideo} onOpenChange={setShowAddVideo} onAddVideo={handleAddVideo} />
      </div>
    </div>
  )
}
