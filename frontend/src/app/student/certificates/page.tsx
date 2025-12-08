"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Award, Download, Search, FileText, Calendar } from "lucide-react";
import { studentCertificateApi } from "@/services/APIservices/studentApiservice";
import Header from "@/components/student/header";
import type { Certificate, CertificateApiResponse } from "@/types/student/certificates";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  /* -------------------------------------------------------
      Fetch Certificates (with useCallback)
  -------------------------------------------------------- */
  const fetchCertificates = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const res: CertificateApiResponse = await studentCertificateApi.getMyCertificates({
        page,
        limit: 6,
        search: searchTerm,
      });

      if (res.ok) {
        setCertificates(res.data.certificates);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching certificates", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchCertificates(); // eslint compliant
  }, [fetchCertificates]);

  /* -------------------------------------------------------
      Search Handler
  -------------------------------------------------------- */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setPage(1); // reset page on new search
  };

  /* -------------------------------------------------------
      Page Layout
  -------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Certificates</h1>
            <p className="text-gray-500 text-sm">
              Your verified course completion certificates
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {certificates.length}
            </div>
            <div className="text-xs text-gray-500 uppercase">Shown</div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : certificates.length > 0 ? (
          <>
            <div className="space-y-4">
              {certificates.map((cert) => (
                <CertificateItem key={cert._id} cert={cert} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
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

/* -------------------- CARD -------------------- */
function CertificateItem({ cert }: { cert: Certificate }) {
  const issued = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = async (): Promise<void> => {
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center">
            <Award size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{cert.courseId.title}</h3>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={15} />
                {issued}
              </div>
              <div className="flex items-center gap-1">
                <FileText size={15} />
                <span className="font-mono text-xs">{cert.certificateNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1 justify-center"
          >
            <Download size={16} /> Download
          </button>

          <button
            onClick={() => window.open(cert.certificateUrl, "_blank")}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- EMPTY -------------------- */
function EmptyState() {
  return (
    <div className="text-center py-20">
      <Award className="mx-auto text-gray-400" size={80} />
      <h3 className="text-lg font-medium mt-4">No certificates found</h3>
      <p className="text-gray-500 text-sm">
        Try adjusting your search or filters
      </p>
    </div>
  );
}

/* -------------------- LOADING -------------------- */
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-32 bg-white border border-gray-200 rounded-xl animate-pulse"
        ></div>
      ))}
    </div>
  );
}
