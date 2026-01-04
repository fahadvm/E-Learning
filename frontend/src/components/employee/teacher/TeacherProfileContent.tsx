"use client";

import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    Globe,
    Linkedin,
    Instagram,
    Github,
    Star,
    Book,
    MessageSquare,
    GraduationCap,
    Briefcase,
} from "lucide-react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

interface Experience {
    title: string;
    company: string;
    from: string;
    to: string;
    description: string;
    duration?: string;
}

interface Education {
    degree: string;
    institution: string;
    from: string;
    to: string;
    description: string;
}

interface ITeacherProfile {
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    about: string;
    website: string;
    skills: string[];
    social_links: {
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
    experiences: Experience[];
    education: Education[];
}

interface Review {
    studentId?: { name: string; profilePicture?: string };
    employeeId?: { name: string; profilePicture?: string };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function TeacherProfileContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const teacherId = params?.id as string;
    const courseId = searchParams.get("courseId");

    const [teacher, setTeacher] = useState<ITeacherProfile | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Review modal states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ================================
    // Fetch Teacher Data
    // ================================
    useEffect(() => {
        if (!teacherId) return;

        const fetchTeacherData = async () => {
            try {
                setLoading(true);

                const profileRes = await employeeApiMethods.getTeacherDetails(teacherId);
                setTeacher(profileRes.data);

                const reviewRes = await employeeApiMethods.getTeacherReviews(teacherId);
                setReviews(reviewRes.data || []);

            } catch (err) {
                console.error("Failed to load teacher data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, [teacherId]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!teacher) return <div className="text-center mt-10 text-gray-500">Teacher not found</div>;

    // ================================
    // Avg Rating
    // ================================
    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : "0";

    const hasValidCourse = !!courseId;

    const handleChat = () => router.push(`/employee/chat/${teacherId}`);

    // ================================
    // Submit Review
    // ================================
    const handleSubmitReview = async () => {
        if (rating === 0) return alert("Please select a rating");

        try {
            setSubmitting(true);

            await employeeApiMethods.addTeacherReview({
                teacherId,
                rating,
                comment,
            });

            // Refresh reviews
            const reviewRes = await employeeApiMethods.getTeacherReviews(teacherId);
            setReviews(reviewRes.data || []);

            setShowReviewModal(false);
            setRating(0);
            setComment("");
        } catch (err) {
            alert("Failed to submit review");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen px-4 sm:px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center text-muted-foreground">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDEBAR */}
                    <aside className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <Image
                                src={teacher.profilePicture || "/gallery/avatar.jpg"}
                                alt="Teacher"
                                width={128}
                                height={128}
                                className="w-32 h-32 mx-auto rounded-full object-cover border-2 border-blue-200"
                            />

                            <h2 className="text-xl font-semibold mt-4 text-gray-800">{teacher.name}</h2>

                            {/* Rating */}
                            <div className="mt-4 flex justify-center items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={18}
                                            className={
                                                idx < Math.round(Number(averageRating))
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">({averageRating} / 5)</span>
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                {/* {hasValidCourse && (
                                    // <button
                                    //     onClick={handleChat}
                                    //     className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    // >
                                    //     <MessageSquare size={18} /> Chat
                                    // </button>
                                )} */}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Contact</h3>
                            <ul className="space-y-3 text-gray-700 text-sm">
                                <li className="flex items-center gap-2">
                                    <Mail size={16} /> {teacher.email || "N/A"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone size={16} /> {teacher.phone || "N/A"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Globe size={16} /> {teacher.website || "N/A"}
                                </li>
                            </ul>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Social Links</h3>
                            <ul className="space-y-3 text-sm">
                                {teacher.social_links?.linkedin && (
                                    <li className="flex items-center gap-2 text-blue-700">
                                        <Linkedin size={16} />
                                        <a href={teacher.social_links.linkedin} target="_blank">
                                            LinkedIn
                                        </a>
                                    </li>
                                )}

                                {teacher.social_links?.instagram && (
                                    <li className="flex items-center gap-2 text-pink-600">
                                        <Instagram size={16} />
                                        <a href={teacher.social_links.instagram} target="_blank">
                                            Instagram
                                        </a>
                                    </li>
                                )}

                                {teacher.social_links?.twitter && (
                                    <li className="flex items-center gap-2 text-sky-500">
                                        <Github size={16} />
                                        <a href={teacher.social_links.twitter} target="_blank">
                                            GitHub
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                                <Book size={18} /> About Me
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {teacher.about || "No bio provided."}
                            </p>
                        </section>

                        {/* Skills */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                                <Star size={18} /> Skills
                            </h3>
                            {teacher.skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {teacher.skills.map((skill: string, i: number) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No skills listed.</p>
                            )}
                        </section>

                        {/* Experience */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                                <Briefcase size={18} /> Experience
                            </h3>
                            {teacher.experiences?.length > 0 ? (
                                teacher.experiences.map((exp, i) => (
                                    <div key={i} className="mb-6 border-b pb-4 last:border-0">
                                        <p className="font-medium text-gray-800">
                                            {exp.title} at {exp.company}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {exp.from} – {exp.to} ({exp.duration})
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No experience added.</p>
                            )}
                        </section>

                        {/* Education */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                                <GraduationCap size={18} /> Education
                            </h3>
                            {teacher.education?.length > 0 ? (
                                teacher.education.map((edu, i) => (
                                    <div key={i} className="mb-6 border-b pb-4 last:border-0">
                                        <p className="font-medium text-gray-800">
                                            {edu.degree} at {edu.institution}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {edu.from} – {edu.to}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No education found.</p>
                            )}
                        </section>

                        {/* ====================== REVIEWS ====================== */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Star size={18} /> User Reviews
                                </h3>

                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                                >
                                    Write a Review
                                </button>
                            </div>

                            {reviews.length > 0 ? (
                                reviews.map((rev, i) => {
                                    const user = rev.employeeId || rev.studentId;
                                    return (
                                        <div key={i} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                    {user?.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">{user?.name?.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    {user?.name || "Anonymous"}
                                                </span>

                                                <div className="flex">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star
                                                            key={idx}
                                                            size={16}
                                                            className={
                                                                idx < Math.round(rev.rating)
                                                                    ? "text-yellow-400 fill-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600">{rev.comment}</p>

                                            <p className="text-xs text-gray-500 mt-1 text-muted-foreground">
                                                {new Date(rev.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">No reviews yet.</p>
                            )}
                        </section>
                    </main>
                </div>
            </div>

            {/* ====================== REVIEW MODAL ====================== */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-scaleIn">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>

                        {/* Rating */}
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Star
                                    key={num}
                                    size={24}
                                    onClick={() => setRating(num)}
                                    className={`cursor-pointer transition ${num <= rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Comment */}
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
