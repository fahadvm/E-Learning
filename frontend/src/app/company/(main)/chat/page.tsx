'use client';

import CompanyChatWindow from '@/components/company/chat/CompanyChatWindow';
import { useCompany } from '@/context/companyContext';
import React from 'react';

const CompanyChatPage = () => {
    const { company } = useCompany();

    if (!company) {
        return <div className="p-4">Loading company details...</div>;
    }

    return (
        <div className="p-6 h-full">
            <h1 className="text-2xl font-bold mb-4">Company Group Chat</h1>
            <CompanyChatWindow
                companyId={company._id!}
                currentUserId={company._id!}
                currentUserType="Company"
            />
        </div>
    );
};

export default CompanyChatPage;
