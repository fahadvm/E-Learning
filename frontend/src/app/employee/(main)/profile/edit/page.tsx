'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/context/studentContext';
import { StudentApiMethods } from '@/services/APImethods';
import Header from '@/components/student/header';
import dynamic from 'next/dynamic';
import { showSuccessToast } from '@/utils/Toast';

const CropperModal = dynamic(() => import('@/components/common/ImageCropper'), { ssr: false });

interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
}

interface FormDataType {
  name: string;
  about: string;
  phone: string;
  social_links: SocialLinks;
  profilePicture: string;
}

interface FormErrors {
  name?: string;
  about?: string;
  phone?: string;
  profilePicture?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function EditProfilePage() {
  const { student, setStudent } = useStudent();
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    about: '',
    phone: '',
    social_links: {
      linkedin: '',
      twitter: '',
      instagram: ''
    },
    profilePicture: ''
  });   

  const [errors, setErrors] = useState<FormErrors>({});
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        about: student.about || '',
        phone: student.phone || '',
        profilePicture: student.profilePicture || '',
        social_links: {
          linkedin: student.social_links?.linkedin || '',
          twitter: student.social_links?.twitter || '',
          instagram: student.social_links?.instagram || ''
        }
      });
    }
  }, [student]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('social_links.')) {
      const key = name.split('.')[1] as keyof SocialLinks;
      setFormData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (img: string) => {
    setCroppedImage(img);
    setFormData(prev => ({ ...prev, profilePicture: img }));
    setShowCropper(false);
  };

const validateForm = () => {
  const newErrors: FormErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = 'Enter a valid 10-digit phone number';
  }

  if (formData.social_links.linkedin &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(formData.social_links.linkedin)) {
    newErrors.social_links = {
      ...newErrors.social_links,
      linkedin: 'Enter a valid LinkedIn URL'
    };
  }

  if (formData.social_links.twitter &&
      !/^https?:\/\/(www\.)?twitter\.com\/.+$/.test(formData.social_links.twitter)) {
    newErrors.social_links = {
      ...newErrors.social_links,
      twitter: 'Enter a valid Twitter URL'
    };
  }

  if (formData.social_links.instagram &&
      !/^https?:\/\/(www\.)?instagram\.com\/.+$/.test(formData.social_links.instagram)) {
    newErrors.social_links = {
      ...newErrors.social_links,
      instagram: 'Enter a valid Instagram URL'
    };
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0 && !newErrors.social_links;
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    try {
      const res = await StudentApiMethods.editProfile(formData);
      if (res?.ok && res.data) {
        showSuccessToast(res?.message)
        setStudent(res.data);
        router.push('/student/profile');
      } else {
        console.error('Profile update failed:', res?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.profilePicture && (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    name="social_links.linkedin"
                    value={formData.social_links.linkedin}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${errors.social_links?.linkedin ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.social_links?.linkedin && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.linkedin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    name="social_links.twitter"
                    value={formData.social_links.twitter}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${errors.social_links?.twitter ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.social_links?.twitter && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.twitter}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    name="social_links.instagram"
                    value={formData.social_links.instagram}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 ${errors.social_links?.instagram ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.social_links?.instagram && (
                    <p className="text-red-500 text-sm mt-1">{errors.social_links.instagram}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {showCropper && rawImage && (
          <CropperModal
            image={rawImage}
            onCropComplete={handleCroppedImage}
            onClose={() => setShowCropper(false)}
          />
        )}
      </div>
    </>
  );
}
