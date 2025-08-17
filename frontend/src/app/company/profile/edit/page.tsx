'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeacher } from '@/context/teacherContext';
import { TeacherApiMethods } from '@/services/APImethods';
import Header from '@/componentssss/teacher/header';
import dynamic from 'next/dynamic';

const CropperModal = dynamic(() => import('@/componentssss/common/ImageCropper'), { ssr: false });

export default function EditProfilePage() {
  const { teacher, setTeacher } = useTeacher();
  const router = useRouter();
  
  interface Education {
    degree: string;
    institution: string;
    from: string;
    to: string;
    description: string;
  }

  interface Experience {
    title: string;
    company: string;
    from: string;
    to: string;
    description: string;
  }

  const [formData, setFormData] = useState({
    name: '',
    about: '',
    phone: '',
    location: '',
    website: '',
    social_links: {
      linkedin: '',
      twitter: '',
      instagram: ''
    },
    skills: [] as string[],
    education: [] as Education[],
    experiences: [] as Experience[],
    profilePicture: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        social_links: { ...teacher.social_links },
        skills: [...teacher.skills],
        education: [...teacher.education],
        experiences: [...teacher.experiences]
      });
    }
  }, [teacher]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('social_links')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await TeacherApiMethods.editProfile(formData);
      if (res?.ok && res.data) {
        setTeacher(res.data);
        router.push('/teacher/profile');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    name="social_links.twitter"
                    value={formData.social_links.twitter}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    name="social_links.instagram"
                    value={formData.social_links.instagram}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <div className="flex gap-3">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <input
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[idx].degree = e.target.value;
                      setFormData(prev => ({ ...prev, education: updated }));
                    }}
                    placeholder="Degree"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <input
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[idx].institution = e.target.value;
                      setFormData(prev => ({ ...prev, education: updated }));
                    }}
                    placeholder="Institution"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={edu.from}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].from = e.target.value;
                        setFormData(prev => ({ ...prev, education: updated }));
                      }}
                      placeholder="From (e.g., 2020)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                    <input
                      value={edu.to}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].to = e.target.value;
                        setFormData(prev => ({ ...prev, education: updated }));
                      }}
                      placeholder="To (e.g., 2024)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <textarea
                    value={edu.description}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[idx].description = e.target.value;
                      setFormData(prev => ({ ...prev, education: updated }));
                    }}
                    placeholder="Description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.education];
                      updated.splice(idx, 1);
                      setFormData(prev => ({ ...prev, education: updated }));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      { degree: '', institution: '', from: '', to: '', description: '' }
                    ]
                  }));
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Education
              </button>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <input
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[idx].title = e.target.value;
                      setFormData(prev => ({ ...prev, experiences: updated }));
                    }}
                    placeholder="Job Title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <input
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[idx].company = e.target.value;
                      setFormData(prev => ({ ...prev, experiences: updated }));
                    }}
                    placeholder="Company"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={exp.from}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[idx].from = e.target.value;
                        setFormData(prev => ({ ...prev, experiences: updated }));
                      }}
                      placeholder="From (e.g., Jan 2022)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                    <input
                      value={exp.to}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[idx].to = e.target.value;
                        setFormData(prev => ({ ...prev, experiences: updated }));
                      }}
                      placeholder="To (e.g., Present)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[idx].description = e.target.value;
                      setFormData(prev => ({ ...prev, experiences: updated }));
                    }}
                    placeholder="Description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.experiences];
                      updated.splice(idx, 1);
                      setFormData(prev => ({ ...prev, experiences: updated }));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    experiences: [
                      ...prev.experiences,
                      { title: '', company: '', from: '', to: '', description: '' }
                    ]
                  }));
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Experience
              </button>
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