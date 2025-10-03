"use client"

import { useState } from 'react';

// Mock request data (replace with actual data from API or props)
const requestData = {
  studentName: "Jane Doe",
  courseName: "Advanced Calculus",
  requestedTime: "09:00 - 09:30",
  date: "Monday, October 6, 2025",
  notes: "I need help with differential equations, specifically solving first-order linear equations. Please prepare some practice problems.",
  status: "Pending",
};

export default function TeacherRequestDetails() {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!requestData) throw new Error("Request data is missing.");
      // Simulate API call for approval
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Request approved for:", requestData);
      alert("Request approved successfully");
    } catch (err: any) {
      setError(err?.message || "Failed to approve the request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (isRejecting && !rejectionReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!requestData) throw new Error("Request data is missing.");
      // Simulate API call for rejection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Request rejected for:", requestData, "Reason:", rejectionReason);
      alert("Request rejected successfully");
    } catch (err: any) {
      setError(err?.message || "Failed to reject the request. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsRejecting(false);
      setRejectionReason("");
    }
  };

  const toggleReject = () => {
    setIsRejecting(!isRejecting);
    setError(null);
    setRejectionReason("");
  };

  if (!requestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Request data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Request Details
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Student Name</h2>
              <p className="mt-1 text-lg text-gray-900">{requestData.studentName}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Course Name</h2>
              <p className="mt-1 text-lg text-gray-900">{requestData.courseName}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Requested Time</h2>
              <p className="mt-1 text-lg text-gray-900">{requestData.requestedTime}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Date</h2>
              <p className="mt-1 text-lg text-gray-900">{requestData.date}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Notes</h2>
              <p className="mt-1 text-lg text-gray-600">{requestData.notes || "No notes provided."}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <span
                className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  requestData.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : requestData.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {requestData.status}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-6 text-red-500 text-center">{error}</p>
          )}

          {/* Rejection Reason Input */}
          {isRejecting && (
            <div className="mt-6">
              <label htmlFor="rejectionReason" className="text-sm font-medium text-gray-500">
                Reason for Rejection
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Please provide a reason for rejecting this request..."
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {isRejecting ? (
              <>
                <button
                  onClick={toggleReject}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Rejection"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleReject}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Approve"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
