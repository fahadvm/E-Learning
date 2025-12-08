// app/teacher/enrollments/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Building2, User, Users } from 'lucide-react';
import Header from '@/components/teacher/header';
import { teacherEnrollmentApi } from '@/services/APIservices/teacherApiService';
import { toast } from 'react-toastify';

interface Enrollment {
    id: string;
    name: string;
    email: string;
    courseTitle: string;
    source: 'company' | 'individual';
    companyName?: string;
    purchasedSeats?: number;   // Only for company
    assignedSeats?: number;    // Only for company
    enrolledAt: string;
    progress?: number;         // Only for individual
    status?: 'Not Started' | 'In Progress' | 'Completed'; // Only for individual
}

const courses = ['All Courses']; // We might want to populate this dynamically too, but for now specific course filtering is secondary or can be derived from data

export default function TeacherEnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('All Courses');
    const [sourceFilter, setSourceFilter] = useState<'All' | 'company' | 'individual'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        setLoading(true);
        const response = await teacherEnrollmentApi.getEnrollments();
        console.log("response",response)
        if (response && response.data) {
            setEnrollments(response.data);
        }
        setLoading(false);
    };

    // Derived courses list from enrollments
    const availableCourses = useMemo(() => {
        const titles = new Set(enrollments.map(e => e.courseTitle));
        return ['All Courses', ...Array.from(titles)];
    }, [enrollments]);

    const filteredData = useMemo(() => {
        return enrollments.filter(enrollment => {
            const matchesSearch = enrollment.name?.toLowerCase().includes(search.toLowerCase()) ||
                enrollment.email?.toLowerCase().includes(search.toLowerCase()) ||
                enrollment.companyName?.toLowerCase().includes(search.toLowerCase());

            const matchesCourse = selectedCourse === 'All Courses' || enrollment.courseTitle === selectedCourse;
            const matchesSource = sourceFilter === 'All' || enrollment.source === sourceFilter;

            return matchesSearch && matchesCourse && matchesSource;
        });
    }, [search, selectedCourse, sourceFilter, enrollments]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Seat Progress Bar for Companies
    const SeatUsageBar = ({ purchased, assigned =  0}: { purchased: number; assigned: number }) => {
        const percentage = (assigned / purchased) * 100;
        const isFull = assigned >= purchased;

        return (
            <>
                <div className="w-48">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">Seats Used</span>
                        <span className={`font-bold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>
                            {assigned} / {purchased}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-indigo-600'
                                }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {purchased - assigned} seat{purchased - assigned !== 1 ? 's' : ''} remaining
                    </p>
                </div>
            </>
        );
    };

    // Individual Progress Bar
    const ProgressBar = ({ progress, status }: { progress: number; status: string }) => (
        <div className="w-32">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${status === 'Completed' ? 'bg-green-500' :
                        status === 'In Progress' ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Student & Company Enrollments</h1>
                        <p className="mt-2 text-gray-600">Track individual students and corporate seat usage</p>
                    </div>

                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        {/* Filters */}
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email or company..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {availableCourses.map(c => <option key={c}>{c}</option>)}
                                </select>

                                <select
                                    value={sourceFilter}
                                    onChange={(e) => setSourceFilter(e.target.value as any)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="All">All Sources</option>
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student / Company</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Enrolled</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.map((enrollment) => (
                                        <tr key={enrollment.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                {enrollment.source === 'company' ? (
                                                    <div className="flex items-center">
                                                        <Users className="w-5 h-5 text-indigo-600 mr-3" />
                                                        <div>
                                                            <div className="text-sm font-bold text-indigo-700">{enrollment.companyName}</div>
                                                            <div className="text-xs text-gray-500">Corporate License</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{enrollment.name}</div>
                                                        <div className="text-sm text-gray-500">{enrollment.email}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {enrollment.courseTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {enrollment.source === 'company' ? (
                                                    <div className="flex items-center text-sm">
                                                        <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
                                                        <span className="font-medium text-indigo-600">Company</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-sm text-green-600">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Individual
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {enrollment.source === 'company' ? (
                                                    enrollment.purchasedSeats  ? (
                                                        <SeatUsageBar purchased={enrollment.purchasedSeats} assigned={enrollment.assignedSeats??0} />
                                                    ) : null
                                                ) : (
                                                    enrollment.progress !== undefined && <ProgressBar progress={enrollment.progress} status={enrollment.status || 'Not Started'} />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {enrollment.source === 'company' ? (
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${enrollment.assignedSeats! >= enrollment.purchasedSeats!
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-indigo-100 text-indigo-800'
                                                        }`}>
                                                        {enrollment.assignedSeats! >= enrollment.purchasedSeats! ? 'Seats Full' : 'Active License'}
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${enrollment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        enrollment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {enrollment.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
                                <span className="font-medium">{filteredData.length}</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}