"use client";

import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Award } from "lucide-react";
import { studentCertificateApi } from "@/services/APIservices/studentApiservice";

interface Certificate {
  _id: string;
  courseId: { _id: string; title: string };
  certificateUrl: string;
  certificateNumber: string;
  issuedAt: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await studentCertificateApi.getMyCertificates();
      console.log("my certificates:",res)
      if (res.ok) setCertificates(res.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Award className="text-indigo-600" /> My Certificates
      </h1>

      {loading ? (
        <LoadingSkeleton />
      ) : certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert._id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Card UI ------------------------------ */
function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
      <div className="w-full h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-semibold">
        {cert.courseId.title}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Certificate No:
        </p>
        <p className="font-semibold">{cert.certificateNumber}</p>
        <p className="text-sm text-gray-500">
          Issued: {new Date(cert.issuedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <a
          href={cert.certificateUrl}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <ExternalLink size={16} /> View
        </a>
        <a
          href={cert.certificateUrl}
          download
          className="flex-1 flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
        >
          <Download size={16} /> Download
        </a>
      </div>
    </div>
  );
}

/* ------------------------------ Loading Skeleton ------------------------------ */
function LoadingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-white/60 dark:bg-gray-800/60 p-5 rounded-2xl h-64"
        ></div>
      ))}
    </div>
  );
}

/* ------------------------------ Empty State ------------------------------ */
function EmptyState() {
  return (
    <div className="text-center py-20">
      <Award className="mx-auto text-gray-400" size={80} />
      <h2 className="text-xl font-semibold mt-4">No Certificates Yet</h2>
      <p className="text-gray-500 mt-2">
        Complete a course to earn your first certificate!
      </p>
    </div>
  );
}
