'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/company/reset-password', {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => router.push('/company/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Reset Company Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white border border-gray-700"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white border border-gray-700"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-2 rounded text-white">
          Reset Password
        </button>

        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </form>
    </div>
  );
}
