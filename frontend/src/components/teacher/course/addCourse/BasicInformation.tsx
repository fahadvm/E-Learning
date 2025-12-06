'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Plus, Trash2, X } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

interface CourseData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: number;
  currency: string;
  isTechnicalCourse: boolean;
  coverImage: File | null;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  isPublished: boolean;
  allowDiscounts: boolean;
  totalDuration: number;
}

interface BasicInformationProps {
  courseData: CourseData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseData>>;
}

const categories = [
  'Development',
  'Programming',
  'Database',
  'Tools',
  'Backend',
  'Frontend',
  'Design',
  'Hosting',
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const languages = ['English', 'Malayalam', 'Hindi'];

export default function BasicInformation({ courseData, setCourseData }: BasicInformationProps) {
  const [newTag, setNewTag] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // Handle adding a new tag
  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  // Handle removing a tag
  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Add a new learning outcome
  const addLearningOutcome = () => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ''],
    }));
  };

  // Add a new requirement
  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  // Update a learning outcome
  const updateLearningOutcome = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => (i === index ? value : outcome)),
    }));
  };

  // Update a requirement
  const updateRequirement = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => (i === index ? value : req)),
    }));
  };

  // Handle image upload and open cropper
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture cropped area coordinates
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate cropped image as a File
  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise(resolve => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const file = new File([blob], 'cropped_coverImage.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  };

  // Save cropped image and close cropper
  const handleCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCourseData(prev => ({ ...prev, coverImage: croppedFile }));
        setShowCropper(false);
        setImageSrc(null);
      } catch (error) {
        console.error('Error cropping image:', error);
        alert('Failed to crop image. Please try again.');
      }
    }
  };

  // Cancel cropping and reset
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={courseData.title}
              onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Complete React Development Course"
              className="mt-1"
              data-testid="input-course-title"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Course Subtitle</Label>
            <Input
              id="subtitle"
              value={courseData.subtitle}
              onChange={(e) => setCourseData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="A brief description of your course"
              className="mt-1"
              data-testid="input-course-subtitle"
            />
          </div>

          <div>
            <Label htmlFor="description">Course Description *</Label>
            <textarea
              id="description"
              value={courseData.description}
              onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of what students will learn..."
              className="mt-1 w-full min-h-32 p-3 rounded-md border border-input bg-background text-sm resize-none"
              data-testid="textarea-course-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={courseData.category}
                onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                data-testid="select-course-category"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="level">Course Level *</Label>
              <select
                id="level"
                value={courseData.level}
                onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                data-testid="select-course-level"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NEW CHECKBOX */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isTechnicalCourse"
              checked={courseData.isTechnicalCourse}
              onChange={(e) => setCourseData(prev => ({ ...prev, isTechnicalCourse: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              data-testid="checkbox-is-technical-course"
            />
            <Label
              htmlFor="isTechnicalCourse"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This is a technical course that requires a compiler
            </Label>
          </div>

          <div>
            <Label htmlFor="language">Primary Language</Label>
            <select
              id="language"
              value={courseData.language}
              onChange={(e) => setCourseData(prev => ({ ...prev, language: e.target.value }))}
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              data-testid="select-course-language"
            >
              {languages.map(language => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Course coverImage</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Upload course coverImage (16:9 ratio recommended)</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="mt-2"
                data-testid="input-upload-coverImage"
              />
              {courseData.coverImage && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Selected: {courseData.coverImage.name}</p>
                  <img
                    src={courseData.coverImage}
                    alt="Cropped coverImage preview"
                    className="mt-2 max-w-xs mx-auto rounded-md object-cover"
                    style={{ aspectRatio: '16/9' }}
                  />
                </div>
              )}
            </div>
          </div>

          {showCropper && imageSrc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Crop coverImage</h3>
                  <Button variant="ghost" onClick={handleCancelCrop} data-testid="button-cancel-crop">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative w-full h-64">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    restrictPosition={false}
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancelCrop}>
                    Cancel
                  </Button>
                  <Button onClick={handleCrop} data-testid="button-crop-image">
                    Crop & Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Tags</Label>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  data-testid="input-course-tag"
                />
                <Button onClick={addTag} size="sm" data-testid="button-add-tag">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Learning Outcomes</Label>
            <div className="mt-1 space-y-2">
              {courseData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={outcome}
                    onChange={(e) => updateLearningOutcome(index, e.target.value)}
                    placeholder="What will students learn?"
                    data-testid={`input-learning-outcome-${index}`}
                  />
                  {courseData.learningOutcomes.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCourseData(prev => ({
                          ...prev,
                          learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addLearningOutcome}
                data-testid="button-add-outcome"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Learning Outcome
              </Button>
            </div>
          </div>

          <div>
            <Label>Prerequisites</Label>
            <div className="mt-1 space-y-2">
              {courseData.requirements.map((requirement, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="What should students know beforehand?"
                    data-testid={`input-requirement-${index}`}
                  />
                  {courseData.requirements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCourseData(prev => ({
                          ...prev,
                          requirements: prev.requirements.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addRequirement}
                data-testid="button-add-requirement"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Prerequisite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}