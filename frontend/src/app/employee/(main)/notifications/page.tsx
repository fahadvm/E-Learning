"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BookOpen, Trophy, AlertCircle, CheckCircle2, Trash2 } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "course",
    title: "New Course Available",
    message: "Advanced React Patterns is now available for enrollment",
    time: "2 hours ago",
    read: false,
    icon: BookOpen,
  },
  {
    id: 2,
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You earned the 'Quick Learner' badge for completing 3 courses",
    time: "5 hours ago",
    read: false,
    icon: Trophy,
  },
  {
    id: 3,
    type: "deadline",
    title: "Course Deadline Approaching",
    message: "TypeScript Mastery course is due in 3 days",
    time: "1 day ago",
    read: true,
    icon: AlertCircle,
  },
  {
    id: 4,
    type: "completion",
    title: "Course Completed",
    message: "Congratulations! You completed Node.js Best Practices",
    time: "2 days ago",
    read: true,
    icon: CheckCircle2,
  },
  {
    id: 5,
    type: "course",
    title: "Course Update",
    message: "Web Performance Optimization has new lessons available",
    time: "3 days ago",
    read: true,
    icon: BookOpen,
  },
  {
    id: 6,
    type: "achievement",
    title: "Leaderboard Update",
    message: "You moved up to rank #4 on the all-time leaderboard",
    time: "4 days ago",
    read: true,
    icon: Trophy,
  },
]

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [selectedTab, setSelectedTab] = useState("all")

  const unreadCount = notificationList.filter((n) => !n.read).length

  const filteredNotifications = notificationList.filter((n) => {
    if (selectedTab === "unread") return !n.read
    if (selectedTab === "courses") return n.type === "course"
    if (selectedTab === "achievements") return n.type === "achievement"
    return true
  })

  const markAsRead = (id: number) => {
    setNotificationList(notificationList.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotificationList(notificationList.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your learning progress</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card
                  key={notification.id}
                  className={`p-4 transition-colors ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${!notification.read ? "bg-primary/20" : "bg-muted"}`}
                    >
                      <Icon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">All caught up</h3>
              <p className="text-muted-foreground">No unread notifications</p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card key={notification.id} className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No course notifications</h3>
              <p className="text-muted-foreground">Check back later for course updates</p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card key={notification.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No achievement notifications</h3>
              <p className="text-muted-foreground">Keep learning to unlock achievements</p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card key={notification.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
