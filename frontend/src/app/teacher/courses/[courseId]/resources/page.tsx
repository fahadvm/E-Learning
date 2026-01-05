"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/teacher/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload, ArrowLeft } from "lucide-react";
import {
  teacherCourseApi,
} from "@/services/APIservices/teacherApiService";
import { ICourseResource } from "@/types/teacher/courseResource";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";

export default function CourseResourcesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [resources, setResources] = useState<ICourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ title?: string; file?: string }>({});

  // Fetch resources
  useEffect(() => {
    if (!courseId) return;

    const loadResources = async () => {
      try {
        const res = await teacherCourseApi.getResources(courseId);
        if (res && res.data) {
          setResources(res.data);
        } else if (Array.isArray(res)) {
          setResources(res);
        }

      } catch {
        showInfoToast("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    void loadResources();
  }, [courseId]);

  const validateForm = () => {
    const newErrors: { title?: string; file?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!file) newErrors.file = "Please select a file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseId || !validateForm() || !file) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      if (description.trim()) formData.append("description", description);
      formData.append("file", file);

      const res = await teacherCourseApi.addResources(courseId, formData);
      showSuccessToast(res?.message ?? "Resource added");

      const refreshed = await teacherCourseApi.getResources(courseId);
      if (refreshed && refreshed.data) {
        setResources(refreshed.data);
      } else if (Array.isArray(refreshed)) {
        setResources(refreshed);
      }


      setTitle("");
      setDescription("");
      setFile(null);
    } catch {
      showInfoToast("Failed to upload resource");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!courseId) return;

    const confirmDelete = window.confirm("Delete this resource?");
    if (!confirmDelete) return;

    try {
      await teacherCourseApi.deleteResources(resourceId);
      showSuccessToast("Resource deleted");
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch {
      showInfoToast("Failed to delete resource");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading resources...
        </p>
      </div>
    );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Bar */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/teacher/courses/${courseId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Course
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Resources
            </h1>
          </div>

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Add Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Slides, Notes, Assignments"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    File
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.mp4"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {errors.file && (
                    <p className="text-sm text-red-500 mt-1">{errors.file}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting}>
                    <Upload className="w-4 h-4 mr-2" />
                    {submitting ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List Resources */}
          <Card>
            <CardHeader>
              <CardTitle>All Resources</CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No resources yet. Upload your first!
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((res) => (
                    <div
                      key={res._id}
                      className="flex items-start justify-between border rounded-md p-3 bg-white"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{res.title}</p>
                        {res.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {res.description}
                          </p>
                        )}
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-cyan-700 hover:underline mt-2 inline-block"
                        >
                          View / Download
                        </a>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(res.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(res._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
