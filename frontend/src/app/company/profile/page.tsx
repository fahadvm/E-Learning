'use client';

import Link from 'next/link';
import Header from '@/components/company/Header';
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, Linkedin, Instagram, Twitter, MapPin, Clipboard, Check } from 'lucide-react';
import { useCompany } from '@/context/companyContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showSuccessToast } from '@/utils/Toast';
import VerificationModal from '@/components/company/profile/VerificationModal';
import { companyApiMethods } from '@/services/APIservices/companyApiService';

export default function CompanyProfilePage() {
  const { company, setCompany } = useCompany();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Wait until company data is fully loaded
  useEffect(() => {
    if (company) {
      setLoading(false);
    }
  }, [company]);

  if (loading || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading company profile...
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(company.companyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  const submitVerification = async (data: {
    name: string;
    address: string;
    phone: string;
    certificate: File | null;
    taxId: File | null;
  }) => {

    if (!company._id) return
    const form = new FormData();
    form.append('name', data.name);
    form.append('address', data.address);
    form.append('phone', data.phone);
    if (data.certificate) form.append('certificate', data.certificate);
    if (data.taxId) form.append('taxId', data.taxId);
    form.append('companyId', company?._id);

    const res = await companyApiMethods.verifyCompanyProfile(form)

    if (res.ok) {
      setCompany({ ...company, isVerified: false, status: 'pending' });
      showSuccessToast('Verification request sent! We’ll review it shortly.');
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img
                src={company.profilePicture || "/gallery/avatar.jpg"}
                alt="Profile"
                className="w-32 h-32 mx-auto rounded-full object-cover border"
              />
              <h2 className="text-xl font-semibold mt-4">{company.name}</h2>

              {/* Company Code with Copy Button */}
              <div className="mt-2 flex items-center justify-center gap-2">
                {company.status === "verified" && (
                  <Badge variant="outline" className="text-green-700">
                    Verified
                  </Badge>
                )}

                {company.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-700">
                    Pending Review
                  </Badge>
                )}

                {company.status === "rejected" && (
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="text-red-700 mb-2">
                      Rejected
                    </Badge>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-blue-900 text-md px-5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                    >
                      Re-submit Verification
                    </button>
                  </div>
                )}

                {company.status === "none" && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-blue-900 text-md px-5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                  >
                    Verify
                  </button>
                )}              </div>

              <Link href="/company/profile/edit">
                <button className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition">
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* company Code  */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4"></h3>
              <ul className="space-y-3 text-gray-700 text-sm">

                <li className="flex items-center gap-2">
                  <span className="font-medium">Company Code:</span>
                  {company.companyCode}
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded-md border hover:bg-gray-100 transition"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
                  </button>
                </li>

              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <Mail size={16} /> {company.email}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} /> {company.phone || 'N/A'}
                </li>
                <li className="flex items-center gap-2">
                  <Globe size={16} /> {company.website || 'No website'}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> {company.address || 'No address'}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> {company.pincode || 'N/A'}
                </li>

              </ul>
            </div>


            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Social Links</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-blue-700"><Linkedin size={16} /> {company.social_links?.linkedin || 'N/A'}</li>
                <li className="flex items-center gap-2 text-pink-600"><Instagram size={16} /> {company.social_links?.instagram || 'N/A'}</li>
                <li className="flex items-center gap-2 text-sky-500"><Twitter size={16} /> {company.social_links?.twitter || 'N/A'}</li>
              </ul>
            </div>
          </aside>

          {/* Right Section */}
          <main className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">About Us</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{company.about || 'No description provided.'}</p>
            </section>

            {/* Courses Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">My Courses</h3>
              {company.courses && company.courses.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                  {/* {company.courses.map((course: any, index: number) => (
                    <li key={index}>{course.title || 'Untitled Course'}</li>
                  ))} */}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No courses specified.</p>
              )}
            </section>

            {/* Employees Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Employees</h3>
              {company.employees && company.employees.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                  {company.employees.map((employee: any, index: number) => (
                    <li key={index}>
                      {employee?.name || 'Unnamed Employee'} - {employee?.position || 'Position not set'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No employees added.</p>
              )}
            </section>
          </main>
        </div>
        <VerificationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmit={submitVerification}
          company={company}
        />

      </div>
    </>
  );
}
