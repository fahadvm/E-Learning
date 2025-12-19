"use client";

import { useEffect, useMemo, useState } from "react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Bell, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCompany } from "@/context/companyContext";
import { showErrorToast } from "@/utils/Toast";

export default function CompanyNotificationModal({ onClose }: { onClose: () => void }) {
  const { company } = useCompany();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tab, setTab] = useState<"unread" | "all">("unread");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company?._id) return;
    companyApiMethods.getNotifications(company._id)
      .then(res => setNotifications(res.data || []))
      .catch(() => showErrorToast("Failed to fetch notifications"))
      .finally(() => setLoading(false));
  }, [company?._id]);

  const filtered = useMemo(() => {
    return tab === "unread"
      ? notifications.filter(n => !n.isRead)
      : notifications;
  }, [notifications, tab]);

  const markRead = async (id: string) => {
    await companyApiMethods.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-black/40">
      <div className="w-full sm:w-[420px] h-full bg-slate-950 border-l border-white/10 p-4 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-white">Notifications</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
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
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bell className="mx-auto mb-2" />
            No notifications
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(notif => (
              <Card
                key={notif._id}
                className={`px-3 py-2 bg-white/5 border-white/10 ${!notif.isRead ? "border-l-4 border-primary" : ""}`}
              >
                {/* Line 1 */}
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium truncate text-white">
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Line 2–3 */}
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">
                  {notif.message}
                </p>

                {/* Line 4 */}
                <div className="flex justify-between items-center mt-1">
                  {notif.link ? (
                    <Link href={notif.link}>
                      <Button variant="link" size="sm" className="h-5 px-0 text-[11px]">
                        View <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  ) : <div />}

                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-[11px]"
                      onClick={() => markRead(notif._id)}
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
