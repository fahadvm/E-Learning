"use client";

import { useEffect, useState } from "react";
import Header from "@/components/company/Header";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { useCompany } from "@/context/companyContext";
import { Loader2, Bell, CheckCircle2, Circle, Clock, ArrowRight, BookOpen, User, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import Link from "next/link";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function CompanyNotificationsPage() {
  const { company } = useCompany();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!company?._id) return;
    try {
      const res = await companyApiMethods.getNotifications(company._id);
      if (res?.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      showErrorToast("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [company?._id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await companyApiMethods.markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      showErrorToast("Failed to mark as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'employee': return <User className="w-5 h-5 text-blue-400" />;
      case 'course': return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'learning-path': return <BookOpen className="w-5 h-5 text-indigo-400" />;
      case 'seat-limit': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'course-complete': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-900" />

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-28">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your company's learning activities.</p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-white h-6">
              {unreadCount} New
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="bg-white/5 border-white/10 text-center py-20">
            <CardContent>
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No notifications yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card
                key={notif._id}
                className={`bg-white/5 border-white/10 transition-all hover:bg-white/10 ${!notif.isRead ? 'border-l-4 border-l-primary' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-lg ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                          {notif.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-gray-400 mb-4">{notif.message}</p>

                      <div className="flex items-center justify-between">
                        {notif.link ? (
                          <Link href={notif.link}>
                            <Button variant="link" className="text-primary p-0 h-auto flex items-center gap-1">
                              View Details <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        ) : <div />}

                        {!notif.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleMarkAsRead(notif._id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
