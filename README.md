# 📚 Trackr - Your Learning Journey, Organized and Synced

Trackr is a comprehensive learning management application designed to help you escape tutorial hell by organizing your educational content into structured learning paths. Whether you're learning web development, photography, music production, or any other skill, Trackr keeps you on track with progress monitoring, note-taking, and seamless cloud synchronization.

## ✨ Features

### Core Functionality

- **📋 Learning Paths**: Create organized collections of educational content
- **🎥 Video Management**: Add individual YouTube videos or import entire playlists
- **📊 Progress Tracking**: Monitor your learning progress with visual indicators
- **📝 Note Taking**: Add personal notes to each video for better retention
- **⭐ Favorites**: Mark important videos for quick access
- **🏷️ Tagging System**: Organize content with custom tags

### Advanced Features

- **🔄 Drag & Drop**: Reorder videos within learning paths
- **☁️ Cloud Sync**: Seamless synchronization across devices with Firebase
- **📱 Offline Support**: Continue learning even without internet connection
- **🎯 Universal Learning**: Support for any learning domain, not just programming
- **📈 Analytics**: Track completion rates and learning streaks
- **🔍 Search & Filter**: Find content quickly with powerful search tools

### User Experience

- **🎨 Modern UI**: Clean, responsive design that works on all devices
- **⚡ Fast Performance**: Optimized for speed with local-first architecture
- **🌙 Focus Mode**: Distraction-free learning environment
- **📊 Progress Visualization**: Beautiful charts and progress bars

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Firebase account (for cloud sync)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/thebasilugo/trackr.git
   cd trackr
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Learning Path

1. **Click "New Learning Path"** on the dashboard
2. **Choose a template** or create a custom path
3. **Fill in details**: Name, description, icon, and color
4. **Start adding content** to your path

### Adding Content

**Individual Videos:**

1. Click "Add Video" in your learning path
2. Paste a YouTube URL
3. Add notes and tags (optional)
4. Click "Add Video"

**YouTube Playlists:**

1. Click "Import Playlist" on the dashboard
2. Paste a YouTube playlist URL
3. All videos will be imported automatically

### Tracking Progress

- **Not Started**: Videos you haven't begun
- **In Progress**: Currently watching or partially completed
- **Completed**: Fully understood and finished
- **Favorites**: Mark important videos with the heart icon

### Managing Your Content

- **Drag & Drop**: Reorder videos by dragging the grip handle
- **Search**: Use the search bar to find specific content
- **Filter**: Filter by completion status
- **Notes**: Add personal notes to remember key concepts

## 🛠️ Technology Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons

### Backend & Database

- **Firebase**: Authentication and Firestore database
- **Local Storage**: Offline-first data persistence

### Additional Libraries

- **@dnd-kit**: Drag and drop functionality
- **React Hook Form**: Form management
- **Sonner**: Toast notifications

## 🏗️ Project Structure

\`\`\`
trackr/
├── app/ # Next.js app directory
│ ├── path/[id]/ # Learning path pages
│ ├── watch/[pathId]/[videoId]/ # Video watch pages
│ ├── layout.tsx # Root layout
│ └── page.tsx # Dashboard
├── components/ # Reusable components
│ ├── ui/ # shadcn/ui components
│ ├── firebase-provider.tsx
│ ├── video-card.tsx
│ └── ...
├── types/ # TypeScript type definitions
├── lib/ # Utility functions
└── public/ # Static assets
\`\`\`

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Anonymous sign-in)
3. Create a Firestore database
4. Copy your config keys to \`.env.local\`

### Customization

- **Colors**: Modify the color palette in \`tailwind.config.js\`
- **Icons**: Change learning path icons in \`create-path-dialog.tsx\`
- **Templates**: Add new path templates in the preset arrays

## 📱 Offline Support

Trackr works offline by default:

- All data is stored locally first
- Changes sync automatically when online
- Offline indicator shows connection status
- No internet required for basic functionality

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/amazing-feature\`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: \`git commit -m 'Add amazing feature'\`
5. **Push to the branch**: \`git push origin feature/amazing-feature\`
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: Use the GitHub Issues tab with the "bug" label
- **Feature Requests**: Use the GitHub Issues tab with the "enhancement" label
- **Questions**: Start a discussion in the GitHub Discussions tab

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Vercel** for hosting and deployment
- **Firebase** for backend services
- **YouTube** for the video platform integration

## 📞 Contact & Support

- **Developer**: [thebasilugo](https://thebasilugo.vercel.app)
- **GitHub**: [github.com/thebasilugo](https://github.com/thebasilugo)
- **Website**: [thebasilugo.vercel.app](https://thebasilugo.vercel.app)

---

**Made with ❤️ by thebasilugo**

_Escape tutorial hell. Start learning with purpose._
