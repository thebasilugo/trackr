"use client"

import { useState } from "react"
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFirebase } from "@/components/firebase-provider"

export function ConnectionStatus() {
  const [showDetails, setShowDetails] = useState(false)
  const { isOnline, isFirebaseAvailable, retryConnection, firebaseStatus } = useFirebase()

  const getStatusColor = () => {
    if (isOnline && isFirebaseAvailable) return "text-green-600 bg-green-50"
    if (isOnline && !isFirebaseAvailable) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusText = () => {
    if (isOnline && isFirebaseAvailable) return "Online & Synced"
    if (isOnline && !isFirebaseAvailable) return "Online (Local Only)"
    return "Offline"
  }

  const getStatusIcon = () => {
    if (isOnline && isFirebaseAvailable) return <Cloud className="w-3 h-3 mr-1" />
    if (isOnline && !isFirebaseAvailable) return <AlertTriangle className="w-3 h-3 mr-1" />
    return <CloudOff className="w-3 h-3 mr-1" />
  }

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger asChild>
        <Badge variant="secondary" className={`cursor-pointer ${getStatusColor()}`}>
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connection Status</DialogTitle>
          <DialogDescription>Current status of your internet connection and Firebase services</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                {isOnline ? (
                  <Wifi className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 mr-2 text-red-600" />
                )}
                Internet Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}>
                {isOnline ? "Connected" : "Disconnected"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                {isFirebaseAvailable ? (
                  <Cloud className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <CloudOff className="w-4 h-4 mr-2 text-red-600" />
                )}
                Firebase Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Configuration:</span>
                <Badge variant={firebaseStatus.configured ? "default" : "destructive"}>
                  {firebaseStatus.configured ? "Valid" : "Invalid"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>App:</span>
                <Badge variant={firebaseStatus.app ? "default" : "destructive"}>
                  {firebaseStatus.app ? "Connected" : "Failed"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Authentication:</span>
                <Badge variant={firebaseStatus.auth ? "default" : "destructive"}>
                  {firebaseStatus.auth ? "Connected" : "Failed"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Firestore:</span>
                <Badge variant={firebaseStatus.firestore ? "default" : "destructive"}>
                  {firebaseStatus.firestore ? "Connected" : "Failed"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                {isFirebaseAvailable
                  ? "Data is synced to the cloud and available offline"
                  : "Data is stored locally only. Cloud sync unavailable."}
              </p>
            </CardContent>
          </Card>

          {!isFirebaseAvailable && (
            <Button onClick={retryConnection} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
