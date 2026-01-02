"use client";

import { useEffect, useMemo, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { Loader2, Bell, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { showErrorToast } from "@/utils/Toast";

import { INotification as Notification } from "@/types/employee/employeeTypes";

import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:w-[420px] bg-background border-l border-border h-full p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Notifications</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            ✕
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
          {["unread", "all"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as "unread" | "all")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              {t === "unread" ? "Unread" : "All"}
              {t === "unread" && filtered.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-bold">
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
            <p className="text-muted-foreground animate-pulse">Syncing notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Up to date!</h4>
            <p className="text-muted-foreground text-sm">No new notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(notif => (
              <Card
                key={notif._id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md ${!notif.isRead ? "border-l-4 border-l-primary" : ""
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold truncate pr-4 group-hover:text-primary transition-colors">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {notif.message}
                  </p>

                  <div className="flex justify-between items-center">
                    {notif.link ? (
                      <Link href={notif.link} onClick={onClose}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-[11px] font-bold bg-primary/5 hover:bg-primary/10 text-primary border-none"
                        >
                          View Details <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <div />
                    )}

                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => handleMarkAsRead(notif._id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
