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

import { createPortal } from "react-dom";

export default function CompanyNotificationModal({ onClose }: { onClose: () => void }) {
  const { company } = useCompany();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tab, setTab] = useState<"unread" | "all">("unread");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-[420px] h-full bg-slate-950 border-l border-white/10 p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">Notifications</h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
          {["unread", "all"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === t
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {t === "unread" ? "Unread" : "All"}
              {t === "unread" && filtered.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-white text-primary text-[10px] rounded-full font-bold">
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 animate-pulse">Fetching updates...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-600" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Workspace clear!</h4>
            <p className="text-gray-500 text-sm">No new notifications here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(notif => (
              <Card
                key={notif._id}
                className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border-white/10 bg-white/11 ${!notif.isRead ? "border-l-4 border-l-primary" : ""
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-sm text-gray-100 group-hover:text-primary transition-colors">
                      {notif.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between">
                    {notif.link ? (
                      <Link href={notif.link} onClick={onClose}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-[11px] font-bold bg-primary/10 hover:bg-primary/20 text-primary border-none"
                        >
                          Take Action <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    ) : <div />}

                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/5"
                        onClick={() => markRead(notif._id)}
                      >
                        Mark as read
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
