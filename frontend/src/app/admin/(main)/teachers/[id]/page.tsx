"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Ban,
    Unlock,
    Star,
    BookOpen,
    Users,
    DollarSign,
    FileText 
} from "lucide-react";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { ITeacherDetails } from "@/types/admin/teacher";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TeacherDetailsPage() {
    const params = useParams();
    const teacherId = params.id as string;

    const [data, setData] = useState<ITeacherDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchTeacher = async () => {
        try {
            const res = await adminApiMethods.getTeacherById(teacherId);
            console.log("details:", res.data)
            setData(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const toggleStatus = async () => {
        if (!data) return;

        setStatusLoading(true);

        try {
            if (data.teacher.isBlocked) {
                await adminApiMethods.unblockTeacher(teacherId);
            } else {
                await adminApiMethods.blockTeacher(teacherId);
            }

            await fetchTeacher();
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }

        setStatusLoading(false);
    };

    useEffect(() => {
        fetchTeacher();
    }, [teacherId]);

    if (loading) return <p className="text-center py-20">Loading...</p>;

    if (!data) return <p className="text-center py-20 text-red-600">Teacher not found</p>;

    const { teacher, courses } = data;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Link href="/admin/teachers">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {teacher.name}
                            <Badge variant={teacher.isBlocked ? "destructive" : "success"}>
                                {teacher.isBlocked ? "blocked" : "active"}
                            </Badge>
                        </h1>
                    </div>
                </div>

                <Button
                    disabled={statusLoading}
                    variant={teacher.isBlocked ? "default" : "destructive"}
                    onClick={toggleStatus}
                >
                    {statusLoading ? "Please wait..." : teacher.isBlocked ? (
                        <>
                            <Unlock className="h-4 w-4 mr-2" /> Unblock
                        </>
                    ) : (
                        <>
                            <Ban className="h-4 w-4 mr-2" /> Block
                        </>
                    )}
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center pb-6 border-b">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={teacher.avatar} />
                                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <h3 className="font-semibold text-lg">{teacher.name}</h3>

                                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span>{teacher.rating}</span>
                                    <span className="text-xs text-slate-400">({teacher.reviews} reviews)</span>
                                </div>
                            </div>

                            <div className="pt-6 space-y-3 text-sm">
                                <div className="flex gap-3 items-center">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{teacher.email}</span>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{teacher.phone}</span>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>Joined {teacher.joinDate}</span>
                                </div>

                                {teacher.resumeUrl && (
                                    <div className="flex gap-3 items-center">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        <Link
                                            href={teacher.resumeUrl}
                                            target="_blank"
                                            className="text-blue-600 hover:underline hover:text-blue-800"
                                        >
                                            View Resume
                                        </Link>
                                    </div>
                                )}
                            </div>


                            <div className="mt-6">
                                <h4 className="font-medium text-sm mb-2">Expertise</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {teacher.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium text-sm mb-2">Bio</h4>
                                <p className="text-sm text-slate-600">{teacher.bio}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Courses</p>
                                        <h3 className="text-xl font-bold">{courses.length}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Students</p>
                                        <h3 className="text-xl font-bold">{teacher.totalStudents}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Earnings</p>
                                        <h3 className="text-xl font-bold">₹{teacher.totalEarnings.toLocaleString()}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* COURSES */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Created Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <div key={course._id} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <img
                                                src={course.thumbnail}
                                                className="w-24 h-16 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{course.title}</h4>
                                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                                    {course.category}
                                                    <span>•</span>
                                                    {course.totalStudents} students
                                                    <span className="flex items-center gap-1 text-yellow-500">
                                                        <Star className="h-3 w-3 fill-current" /> {course.rating}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">₹{course.price}</div>
                                                <Badge variant={course.status === "active" ? "success" : "secondary"}>
                                                    {course.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No courses found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
