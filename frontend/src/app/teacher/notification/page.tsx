"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
import { useTeacher } from "@/context/teacherContext";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { teacher } = useTeacher();
  const userId = teacher?._id;

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      if (!userId) return;
      setLoading(true);

      const res : any = await teacherCallRequestApi.tester(userId)
    
      console.log("Fetched notifications:", res);

      if (res) {
        setNotifications(res.data)
      } else {
        showErrorToast(" Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showErrorToast("Error loading notifications");
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const res : any = await teacherCallRequestApi.testerMark({notificationId:id});
      if (res?.ok) {
        showSuccessToast("Marked as read");
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.log(error)
      showErrorToast("Error marking notification as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Teacher Notifications
            </CardTitle>
            <Button variant="outline" onClick={fetchNotifications}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No notifications yet.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-4 rounded-lg border flex items-start justify-between transition-all
                      ${
                        n.isRead
                          ? "bg-gray-100 border-gray-200"
                          : "bg-white border-primary/30 shadow-sm hover:shadow-md"
                      }`}
                  >
                    <div className="flex gap-3 items-start">
                      {n.isRead ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-500 mt-1" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <p className="text-gray-600 text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!n.isRead && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => markAsRead(n._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
