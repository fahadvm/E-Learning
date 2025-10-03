"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";
import Image from "next/image";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";

// Types
interface Education {
    degree: string;
    institution: string;
    from: string;
    to: string;
    description?: string;
}

interface Teacher {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    education?: Education[];
    experience?: string;
    skills?: string[];
    socialLinks?: {
        linkedin?: string;
        github?: string;
    };
    isBlocked: boolean;
}

interface Course {
    _id: string;
    title: string;
    description?: string;
    isBlocked : boolean;
}

// Zod Schema
const teacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    education: z
        .array(
            z.object({
                degree: z.string(),
                institution: z.string(),
                from: z.string(),
                to: z.string(),
                description: z.string().optional(),
            })
        )
        .optional(),
    experience: z.string().optional(),
    skills: z.string().optional(),
    socialLinks: z
        .object({
            linkedin: z.string().url().optional(),
            github: z.string().url().optional(),
        })
        .optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function TeacherDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
    });

    // Fetch teacher & courses
    useEffect(() => {
        if (!id) return;
        setLoading(true);

        const fetchTeacher = adminApiMethods.getTeacherById(id as string).then((res) => {
            const t: Teacher = res.data;
            setTeacher(t);
            reset({
                ...t,
                skills: t.skills?.join(", ") || "",
            });
        });

        const fetchCourses = adminApiMethods.getTeacherCourses(id as string).then((res) => {
            setCourses(res.data);
        });

        Promise.all([fetchTeacher, fetchCourses])
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, reset]);



    // Block / Unblock Teacher
    const handleBlockToggle = async () => {
        if (!teacher) return;
        try {
            if (teacher.isBlocked) {
                const res = await adminApiMethods.unblockTeacher(teacher._id);
                showSuccessToast("Teacher unblocked successfully");
            } else {
                await adminApiMethods.blockTeacher(teacher._id);
                showSuccessToast("Teacher blocked successfully");
            }
            setTeacher((prev) => (prev ? { ...prev, isBlocked: !prev.isBlocked } : prev));
        } catch (error) {
            console.error(error);
            showErrorToast("Failed to toggle block status");
        }
    };

    if (loading || !teacher) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Teacher Details</h1>

            {/* Teacher Info */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {teacher.profilePicture ? (
                            <Image
                                src={teacher.profilePicture}
                                alt={teacher.name}
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xl">{teacher.name.charAt(0)}</span>
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-semibold">{teacher.name}</h2>
                            <p className="text-gray-600">{teacher.email}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-2">
                        <p><strong>Education:</strong></p>
                        {teacher.education?.length ? (
                            <ul className="list-disc ml-5">
                                {teacher.education.map((edu, idx) => (
                                    <li key={idx}>
                                        {edu.degree} at {edu.institution} ({edu.from} - {edu.to})
                                        {edu.description && ` - ${edu.description}`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>N/A</p>
                        )}

                        <p><strong>Experience:</strong> {teacher.experience || "N/A"}</p>
                        <p><strong>Skills:</strong> {teacher.skills?.join(", ") || "N/A"}</p>
                        <p>
                            <strong>LinkedIn:</strong>{" "}
                            {teacher.socialLinks?.linkedin ? (
                                <Link href={teacher.socialLinks.linkedin} className="text-blue-500">View Profile</Link>
                            ) : "N/A"}
                        </p>
                        <p>
                            <strong>GitHub:</strong>{" "}
                            {teacher.socialLinks?.github ? (
                                <Link href={teacher.socialLinks.github} className="text-blue-500">View Profile</Link>
                            ) : "N/A"}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <ConfirmationDialog
                    title={teacher.isBlocked ? "Unblock teacher" : "Block teacher"}
                    description={
                      teacher.isBlocked
                        ? "Are you sure you want to unblock this teacher?"
                        : "Are you sure you want to block this teacher?"
                    }
                    confirmText={teacher.isBlocked ? "Unblock" : "Block"}
                    onConfirm={handleBlockToggle}
                    triggerButton={
                      <Button
                        className={`px-4 py-2 rounded-md text-white ${teacher.isBlocked ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {teacher.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    }
                  />
                </CardFooter>
            </Card>

            {/* Teacher Courses */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Created Courses</h2>
                </CardHeader>
                <CardContent>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {courses.map((course) => (
                                <div key={course._id} className="p-4 border rounded">
                                    <h3 className="font-medium">{course.title}</h3>
                                    <p className="text-sm text-gray-600">{course.description}</p>
                                    <p className={`text-sm ${course.isBlocked ? 'text-black' : 'text-green-500'}`}>{course.isBlocked ? 'Blocked' : 'Active'}</p>
                                    <Link href={`/admin/courses/${course._id}`} className="text-blue-500">View Details</Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No courses created by this teacher.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
