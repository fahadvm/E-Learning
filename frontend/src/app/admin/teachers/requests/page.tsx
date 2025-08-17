'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TeacherApiMethods } from '@/services/APImethods';

interface Teacher {
    _id: string;
    name: string;
    email: string;

    isVerified: boolean;
}

export default function TeacherVerificationPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnverifiedTeachers = async () => {
            try {
                const res = await TeacherApiMethods.unverified();
                setTeachers(res.data);
            } catch (error) {
                console.error('Failed to fetch unverified teachers');
            } finally {
                setLoading(false);
            }
        };

        fetchUnverifiedTeachers();
    }, []);

    const handleVerify = async (id: string) => {
        try {
            const res = await TeacherApiMethods.verify(id);
            setTeachers((prev) => prev.filter((teacher) => teacher._id !== id));
        } catch (error) {
            console.error('Verification failed');
        }
    };

    const handleReject = async (id: string) => {
        try {
            const res = await TeacherApiMethods.reject(id);
            setTeachers((prev) => prev.filter((teacher) => teacher._id !== id));
        } catch (error) {
            console.error('Rejection failed');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Unverified Teachers</h1>
            {teachers.length === 0 ? (
                <p>No unverified teachers found.</p>
            ) : (
                <ul className="space-y-4">
                    {teachers.map((teacher) => (
                        <li key={teacher._id} className="flex justify-between items-center p-4 border rounded">
                            <div>
                                <p className="font-semibold">{teacher.name}</p>
                                <p className="text-sm text-gray-500">{teacher.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={() => handleVerify(teacher._id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => handleReject(teacher._id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
