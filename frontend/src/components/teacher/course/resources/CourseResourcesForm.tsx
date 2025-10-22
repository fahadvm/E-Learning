"use client";

import { useState, useEffect } from "react";
import { teacherCourseApi } from "@/services/APIservices/teacherApiService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UploadCloud, FileText, FileArchive } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";


interface Resource {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
}

interface Props {
    courseId: string;
}

export default function CourseResourcesForm({ courseId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const res = await teacherCourseApi.fetchCourseResources(courseId);
            setResources(res.data || []);
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleUpload = async () => {
        if (!file || !title) {
            showErrorToast("Please provide both title and file");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        setLoading(true);
        try {
            await teacherCourseApi.uploadCourseResource(courseId, formData);
            showSuccessToast("Resource uploaded successfully");
            setFile(null);
            setTitle("");
            loadResources();
        } catch (error: any) {
            showErrorToast(error.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (resourceId: string) => {
        try {
            await teacherCourseApi.deleteCourseResource(resourceId);
            showSuccessToast("Resource deleted");
            setResources(resources.filter((r) => r._id !== resourceId));
        } catch {
            showErrorToast("Delete failed");
        }
    };

    return (
        <Card className="shadow-md rounded-2xl border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-primary" /> Add Course Resources
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Enter resource title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded-lg p-2 flex-1"
                    />
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border rounded-lg p-2"
                        placeholder="upload pdf resources here..."
                    />
                    <Button onClick={handleUpload} disabled={loading}>
                        {loading ? "Uploading..." : "Upload"}
                    </Button>
                </div>

                {/* Resource List */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.length === 0 ? (
                        <p className="text-gray-500">No resources uploaded yet.</p>
                    ) : (
                        resources.map((r) => (
                            <div
                                key={r._id}
                                className="border rounded-xl p-3 flex items-center justify-between hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-2">
                                    {r.fileType === "zip" ? (
                                        <FileArchive className="text-blue-500 w-5 h-5" />
                                    ) : (
                                        <FileText className="text-green-500 w-5 h-5" />
                                    )}
                                    <a
                                        href={r.fileUrl}
                                        target="_blank"
                                        className="font-medium hover:underline"
                                    >
                                        {r.title}
                                    </a>
                                </div>
                                <p>{r._id}</p>
                                <Trash2
                                    className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition"
                                    onClick={() => handleDelete(r._id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
