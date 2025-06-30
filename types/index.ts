export interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  duration?: string
  status: "not-started" | "in-progress" | "completed"
  notes?: string
  tags?: string[]
  addedAt: string
  completedAt?: string
}

export interface LearningPath {
  id: string
  name: string
  description: string
  color: string
  icon: string
  videos: Video[]
  createdAt: string
  updatedAt: string
}

export interface YouTubeVideoInfo {
  title: string
  thumbnail: string
  duration: string
  videoId: string
}
