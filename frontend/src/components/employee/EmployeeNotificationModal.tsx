"use client";

import { useEffect, useMemo, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { Loader2, Bell, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { showErrorToast } from "@/utils/Toast";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function EmployeeNotificationModal({
  employeeId,
  onClose,
}: {
  employeeId: string;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"unread" | "all">("unread");

  const fetchNotifications = async () => {
    try {
      const res = await employeeApiMethods.getNotifications(employeeId);
      setNotifications(res.data || []);
    } catch {
      showErrorToast("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await employeeApiMethods.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const filtered = useMemo(() => {
    return tab === "unread"
      ? notifications.filter(n => !n.isRead)
      : notifications;
  }, [notifications, tab]);

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-black/40">
      <div className="w-full sm:w-[420px] bg-background border-l border-border h-full p-4 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["unread", "all"].map(t => (
            <Button
              key={t}
              size="sm"
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t as any)}
            >
              {t === "unread" ? "Unread" : "All"}
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="mx-auto mb-2" />
            No notifications
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => (
              <Card
  key={notif._id}
  className={`px-3 py-2 ${!notif.isRead ? "border-l-4 border-primary" : ""}`}
>
  {/* Line 1: Title + Time */}
  <div className="flex justify-between items-center gap-2">
    <h4 className="text-xs font-medium truncate">
      {notif.title}
    </h4>

    <span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
      <Clock className="w-3 h-3" />
      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
    </span>
  </div>

  {/* Line 2–3: Message */}
  <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
    {notif.message}
  </p>

  {/* Line 4: Actions */}
  <div className="flex justify-between items-center mt-1">
    {notif.link ? (
      <Link href={notif.link}>
        <Button
          variant="link"
          size="sm"
          className="h-5 px-0 text-[11px]"
        >
          View <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </Link>
    ) : (
      <div />
    )}

    {!notif.isRead && (
      <Button
        variant="ghost"
        size="sm"
        className="h-5 px-2 text-[11px]"
        onClick={() => handleMarkAsRead(notif._id)}
      >
        Read
      </Button>
    )}
  </div>
</Card>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}
