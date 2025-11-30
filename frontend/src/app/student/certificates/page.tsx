"use client";

import { motion } from "framer-motion";
import { Award, Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

export default function CertificatesPage() {
  /* -------------------------------------------------------
        MOCK CERTIFICATES
  -------------------------------------------------------- */
  const mockCertificates = [
    {
      id: "c1",
      title: "Full-Stack Web Development Bootcamp",
      date: "2025-01-20",
      thumbnail:
        "https://images.unsplash.com/photo-1581091215367-59ab6a5c3b2d?w=800&h=500&fit=crop",
    },
    {
      id: "c2",
      title: "Advanced React & Next.js",
      date: "2025-01-10",
      thumbnail:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    },
    {
      id: "c3",
      title: "UI/UX Design with Figma",
      date: "2024-12-28",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
    },
    {
      id: "c4",
      title: "Node.js Backend Mastery",
      date: "2024-12-15",
      thumbnail:
        "https://images.unsplash.com/photo-1611054777639-8c1a7a3052b5?w=800&h=500&fit=crop",
    },
  ];

  const [certificates, setCertificates] = useState(mockCertificates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------------------------------------------
        LOADING SKELETON
  -------------------------------------------------------- */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 bg-gray-200 dark:bg-gray-700 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
        FINAL PAGE RENDER
  -------------------------------------------------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Certificates
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and download your earned credentials.
        </p>
      </header>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
          >
            {/* Certificate Thumbnail */}
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              <img
                src={cert.thumbnail}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="View"
                >
                  <ExternalLink size={20} />
                </button>
                <button
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                  {cert.title}
                </h3>
                <Award className="text-yellow-500 flex-shrink-0" size={20} />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Issued on {cert.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
