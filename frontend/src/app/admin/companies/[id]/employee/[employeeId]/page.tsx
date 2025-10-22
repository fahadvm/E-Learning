'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/sidebar';
import Loader from '@/components/common/Loader';
import axios from 'axios';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { strict } from 'assert';

interface Employee {
  _id: string;
  name: string;
  department?: string;
  position?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

export default function EmployeeProfile() {
  const router = useRouter();
  const params = useParams(); 
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log(employeeId)
        const response = await adminApiMethods.getEmployeeById(employeeId)
        console.log("response is :", response.data)
        setEmployee(response.data); 
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader loadingTexts="Loading..." />
      </div>
    );

  if (!employee)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Employee not found
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50 mt-5">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 bg-white overflow-auto">
        {/* Header */}
        <header className="bg-gray-600 text-white py-6 px-4 rounded-lg mb-6">
          <h1 className="text-4xl font-bold">Employee Profile</h1>
          <p className="mt-2 text-lg">View and Manage Employee Details</p>
        </header>

        {/* Employee Details */}
        <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-3xl font-semibold mb-6">Employee Details</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={employee.profilePicture || '/icon/no_image.webp'}
                alt={employee.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">{employee.name}</h3>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {employee.email}</p>
              {employee.position && <p className="text-gray-700 mb-2"><strong>Role:</strong> {employee.position}</p>}
              {employee.phone && <p className="text-gray-700 mb-2"><strong>Phone:</strong> {employee.phone}</p>}
            </div>
          </div>
        </section>

        {/* Back Button */}
        <section>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </section>
      </div>
    </div>
  );
}
