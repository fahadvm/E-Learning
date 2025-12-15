"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Award, Download, Search, FileText, Calendar } from "lucide-react";
import { studentCertificateApi } from "@/services/APIservices/studentApiservice";
import Header from "@/components/student/header";
import type { Certificate, CertificateApiResponse } from "@/types/student/certificates";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const res: CertificateApiResponse =
        await studentCertificateApi.getMyCertificates({
          page,
          limit: 6,
          search: searchTerm,
        });

      if (res.ok) {
        setCertificates(res.data.certificates);
        setTotalPages(res.data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* PAGE HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Certificates
            </h1>
            <p className="text-gray-500 text-sm">
              Your verified course completion certificates
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">
              {certificates.length}
            </div>
            <div className="text-xs text-gray-500 uppercase">Shown</div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* SEARCH */}
        <div className="relative w-full sm:max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : certificates.length ? (
          <>
            <div className="space-y-4">
              {certificates.map((cert) => (
                <CertificateItem key={cert._id} cert={cert} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */
function CertificateItem({ cert }: { cert: Certificate }) {
  const issued = new Date(cert.issuedAt).toLocaleDateString();

  const handleDownload = async () => {
    const res = await fetch(cert.certificateUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = cert.courseId.title + ".pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT */}
        <div className="flex gap-4">
          <div className="w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              {cert.courseId.title}
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {issued}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                <span className="font-mono text-xs">
                  {cert.certificateNumber}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-1"
          >
            <Download size={16} /> Download
          </button>

          <button
            onClick={() => window.open(cert.certificateUrl, "_blank")}
            className="px-4 py-2 bg-gray-100 border rounded-lg"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- EMPTY ---------------- */
function EmptyState() {
  return (
    <div className="text-center py-16">
      <Award className="mx-auto text-gray-400" size={72} />
      <h3 className="text-lg font-medium mt-4">No certificates found</h3>
      <p className="text-gray-500 text-sm">
        Try adjusting your search
      </p>
    </div>
  );
}

/* ---------------- LOADING ---------------- */
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 bg-white border rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}
