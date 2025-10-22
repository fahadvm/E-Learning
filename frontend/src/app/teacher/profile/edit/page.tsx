'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeacher } from '@/context/teacherContext';
import Header from '@/components/teacher/header';
import dynamic from 'next/dynamic';
import { showInfoToast, showSuccessToast } from '@/utils/Toast';
import { teacherProfileApi } from '@/services/APIservices/teacherApiService';

const CropperModal = dynamic(() => import('@/components/common/ImageCropper'), { ssr: false });

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  // ===== Validation =====
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.about.trim()) newErrors.about = 'About is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.website && !/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/.test(formData.website))
      newErrors.website = 'Invalid website URL';

    Object.entries(formData.social_links).forEach(([key, value]) => {
      if (value && !/^https?:\/\/.+\..+/.test(value)) {
        newErrors[`social_links.${key}`] = `Invalid ${key} URL`;
      }
    });

    if (!formData.skills.length) newErrors.skills = 'Add at least one skill';

    formData.education.forEach((edu, idx) => {
      if (!edu.degree.trim()) newErrors[`education.${idx}.degree`] = 'Degree required';
      if (!edu.institution.trim()) newErrors[`education.${idx}.institution`] = 'Institution required';
      if (!edu.from.trim()) newErrors[`education.${idx}.from`] = 'From year required';
      if (!edu.to.trim()) newErrors[`education.${idx}.to`] = 'To year required';
    });

    formData.experiences.forEach((exp, idx) => {
      if (!exp.title.trim()) newErrors[`experiences.${idx}.title`] = 'Title required';
      if (!exp.company.trim()) newErrors[`experiences.${idx}.company`] = 'Company required';
      if (!exp.from.trim()) newErrors[`experiences.${idx}.from`] = 'From date required';
      if (!exp.to.trim()) newErrors[`experiences.${idx}.to`] = 'To date required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      showInfoToast('Please fix the errors before submitting');
      return;
    }

    try {
      const res = await teacherProfileApi.editProfile(formData);
      if (res?.ok && res.data) {
        showSuccessToast(res.message);
        setTeacher(res.data);
        router.push('/teacher/profile');
      } else {
        showInfoToast(res.message);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  // ===== Render =====
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                />
                {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                {(['linkedin', 'twitter', 'instagram'] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={`social_links.${key}`}
                      value={formData.social_links[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                    />
                    {errors[`social_links.${key}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`social_links.${key}`]}</p>
                    )}
                  </div>
                ))}
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
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
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
                <div key={idx} className="border rounded-md p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <input
                        name={`education.${idx}.degree`}
                        value={edu.degree}
                        onChange={(e) => {
                          const newEd = [...formData.education];
                          newEd[idx].degree = e.target.value;
                          setFormData({ ...formData, education: newEd });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`education.${idx}.degree`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`education.${idx}.degree`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Institution</label>
                      <input
                        name={`education.${idx}.institution`}
                        value={edu.institution}
                        onChange={(e) => {
                          const newEd = [...formData.education];
                          newEd[idx].institution = e.target.value;
                          setFormData({ ...formData, education: newEd });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`education.${idx}.institution`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`education.${idx}.institution`]}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From</label>
                      <input
                        name={`education.${idx}.from`}
                        type="month"
                        value={edu.from}
                        onChange={(e) => {
                          const newEd = [...formData.education];
                          newEd[idx].from = e.target.value;
                          setFormData({ ...formData, education: newEd });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`education.${idx}.from`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`education.${idx}.from`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To</label>
                      <input
                        name={`education.${idx}.to`}
                        type="month"
                        value={edu.to}
                        onChange={(e) => {
                          const newEd = [...formData.education];
                          newEd[idx].to = e.target.value;
                          setFormData({ ...formData, education: newEd });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`education.${idx}.to`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`education.${idx}.to`]}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => {
                        const newEd = [...formData.education];
                        newEd[idx].description = e.target.value;
                        setFormData({ ...formData, education: newEd });
                      }}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEd = formData.education.filter((_, i) => i !== idx);
                      setFormData({ ...formData, education: newEd });
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    education: [...formData.education, { degree: '', institution: '', from: '', to: '', description: '' }]
                  })
                }
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                Add Education
              </button>
            </div>

            {/* Experiences */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className="border rounded-md p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        value={exp.title}
                        onChange={(e) => {
                          const newEx = [...formData.experiences];
                          newEx[idx].title = e.target.value;
                          setFormData({ ...formData, experiences: newEx });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`experiences.${idx}.title`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`experiences.${idx}.title`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        value={exp.company}
                        onChange={(e) => {
                          const newEx = [...formData.experiences];
                          newEx[idx].company = e.target.value;
                          setFormData({ ...formData, experiences: newEx });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`experiences.${idx}.company`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`experiences.${idx}.company`]}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From</label>
                      <input
                        type="month"
                        value={exp.from}
                        onChange={(e) => {
                          const newEx = [...formData.experiences];
                          newEx[idx].from = e.target.value;
                          setFormData({ ...formData, experiences: newEx });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`experiences.${idx}.from`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`experiences.${idx}.from`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To</label>
                      <input
                        type="month"
                        value={exp.to}
                        onChange={(e) => {
                          const newEx = [...formData.experiences];
                          newEx[idx].to = e.target.value;
                          setFormData({ ...formData, experiences: newEx });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                      />
                      {errors[`experiences.${idx}.to`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`experiences.${idx}.to`]}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newEx = [...formData.experiences];
                        newEx[idx].description = e.target.value;
                        setFormData({ ...formData, experiences: newEx });
                      }}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEx = formData.experiences.filter((_, i) => i !== idx);
                      setFormData({ ...formData, experiences: newEx });
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    experiences: [...formData.experiences, { title: '', company: '', from: '', to: '', description: '' }]
                  })
                }
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                Add Experience
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-sm font-medium"
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
