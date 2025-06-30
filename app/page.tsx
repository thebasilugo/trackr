"use client"

import { useState, useEffect } from "react"
import { Plus, BookOpen, Play, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CreatePathDialog } from "@/components/create-path-dialog"
import type { LearningPath } from "@/types"

export default function Dashboard() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    const savedPaths = localStorage.getItem("trackr-paths")
    if (savedPaths) {
      setPaths(JSON.parse(savedPaths))
    } else {
      // Initialize with sample data
      const samplePaths: LearningPath[] = [
        {
          id: "1",
          name: "Frontend Development",
          description: "Master modern frontend technologies",
          color: "#3B82F6",
          icon: "💻",
          videos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Backend Development",
          description: "Build robust server-side applications",
          color: "#10B981",
          icon: "⚙️",
          videos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setPaths(samplePaths)
      localStorage.setItem("trackr-paths", JSON.stringify(samplePaths))
    }
  }, [])

  const handleCreatePath = (newPath: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => {
    const path: LearningPath = {
      ...newPath,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedPaths = [...paths, path]
    setPaths(updatedPaths)
    localStorage.setItem("trackr-paths", JSON.stringify(updatedPaths))
  }

  const getPathProgress = (path: LearningPath) => {
    if (path.videos.length === 0) return 0
    const completedVideos = path.videos.filter((video) => video.status === "completed").length
    return Math.round((completedVideos / path.videos.length) * 100)
  }

  const getTotalStats = () => {
    const totalVideos = paths.reduce((sum, path) => sum + path.videos.length, 0)
    const completedVideos = paths.reduce(
      (sum, path) => sum + path.videos.filter((video) => video.status === "completed").length,
      0,
    )
    const inProgressVideos = paths.reduce(
      (sum, path) => sum + path.videos.filter((video) => video.status === "in-progress").length,
      0,
    )

    return { totalVideos, completedVideos, inProgressVideos }
  }

  const stats = getTotalStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">📚 Trackr</h1>
              <p className="text-slate-600 text-lg">
                Learn Smart, Not Stuck. Escape tutorial hell with organized learning paths.
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Learning Path
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{paths.length}</p>
                    <p className="text-sm text-slate-600">Learning Paths</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Play className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalVideos}</p>
                    <p className="text-sm text-slate-600">Total Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.completedVideos}</p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.inProgressVideos}</p>
                    <p className="text-sm text-slate-600">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => {
            const progress = getPathProgress(path)
            return (
              <Link key={path.id} href={`/path/${path.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{path.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{path.name}</CardTitle>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: path.color }} />
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">{path.videos.length} videos</Badge>
                        <div className="flex items-center text-sm text-slate-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {path.videos.filter((v) => v.status === "completed").length} completed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {/* Add New Path Card */}
          <Card
            className="border-dashed border-2 hover:border-blue-400 cursor-pointer transition-colors"
            onClick={() => setShowCreateDialog(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-500">
              <Plus className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">Create New Learning Path</p>
              <p className="text-sm text-center">Start organizing your learning journey</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Path Dialog */}
        <CreatePathDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreatePath={handleCreatePath} />
      </div>
    </div>
  )
}
