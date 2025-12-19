'use client';

import CompanyChatWindow from '@/components/company/chat/CompanyChatWindow';
import { useEmployee } from '@/context/employeeContext';
import React from 'react';

const EmployeeChatPage = () => {
    const { employee } = useEmployee();

    if (!employee) {
        return <div className="p-4">Loading employee details...</div>;
    }

    if (!employee.companyId) {
        return <div className="p-4">You are not associated with any company yet.</div>;
    }

    return (
        <div className="p-6 h-full">
            <h1 className="text-2xl font-bold mb-4">Company Group Chat</h1>
            <CompanyChatWindow
                companyId={employee.companyId}
                currentUserId={employee._id}
                currentUserType="Employee"
            />
        </div>
    );
};

export default EmployeeChatPage;
