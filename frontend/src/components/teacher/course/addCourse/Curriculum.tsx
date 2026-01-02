'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Trash2, Video, X, AlertCircle } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { showErrorToast } from '@/utils/Toast';

import { CourseModule, CourseLesson } from '@/types/teacher/course';

interface CurriculumProps {
  modules: CourseModule[];
  setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
}

export default function Curriculum({ modules, setModules }: CurriculumProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('1');

  useEffect(() => {
    if (modules.length === 0) {
      const initialModules: CourseModule[] = Array.from({ length: 7 }, (_, index) => ({
        id: (index + 1).toString(),
        title: `Day ${index + 1}`,
        description: `Introduction to Day ${index + 1}`,
        lessons: [],
      }));
      setModules(initialModules);
    }
  }, [modules, setModules]);

  // Add a new lesson
  const addLesson = (moduleId: string) => {
    const newLesson: CourseLesson = {
      id: Date.now().toString(),
      title: 'New Lesson',
      description: '',
      type: 'video',
      duration: 10,
      isFree: false,
      videoFile: null,
      thumbnail: null,
    };
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module
      )
    );
  };

  // Calculate total duration
  const getTotalDuration = () => {
    return modules.reduce(
      (total, module) =>
        total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0),
      0
    );
  };

  // Calculate total lessons
  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  // Handle video file upload
  const handleVideoUpload = (moduleId: string, lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showErrorToast('Please upload a video file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        showErrorToast('Video size must be less than 100MB');
        return;
      }
      setModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, videoFile: file } : lesson
              ),
            }
            : module
        )
      );
    }
  };

  // Handle thumbnail upload and open cropper
  const handleThumbnailUpload = (moduleId: string, lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showErrorToast('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
        setCurrentModuleId(moduleId);
        setCurrentLessonId(lessonId);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture cropped area
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate cropped thumbnail
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
        const file = new File([blob], 'lesson_thumbnail.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  };

  // Save cropped thumbnail
  const handleCrop = async () => {
    if (imageSrc && croppedAreaPixels && currentModuleId && currentLessonId) {
      try {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        setModules(prev =>
          prev.map(module =>
            module.id === currentModuleId
              ? {
                ...module,
                lessons: module.lessons.map(lesson =>
                  lesson.id === currentLessonId ? { ...lesson, thumbnail: croppedFile } : lesson
                ),
              }
              : module
          )
        );
        setShowCropper(false);
        setImageSrc(null);
        setCurrentModuleId(null);
        setCurrentLessonId(null);
      } catch (error) {
        console.error('Error cropping image:', error);
        showErrorToast('Failed to crop thumbnail. Please try again.');
      }
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCurrentModuleId(null);
    setCurrentLessonId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Curriculum</h3>
          <p className="text-sm text-muted-foreground">
            {getTotalLessons()} lessons • {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m total
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id}>
              {module.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => (
          <TabsContent key={module.id} value={module.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">{module.title}</h4>
                  <Button variant="outline" size="sm" onClick={() => addLesson(module.id)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Lesson
                  </Button>
                </div>
                {/* 🆕 New Module Description Field */}
                <div className="mt-3">
                  <Label className="text-sm font-medium">Module Description</Label>
                  <Input
                    placeholder="Write a short description for this module..."
                    value={module.description}
                    onChange={(e) =>
                      setModules((prev) =>
                        prev.map((m) =>
                          m.id === module.id ? { ...m, description: e.target.value } : m
                        )
                      )
                    }
                  />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {module.lessons.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="flex items-center justify-center text-red-500">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        This day requires at least one lesson
                      </p>
                      <Button variant="outline" size="sm" onClick={() => addLesson(module.id)} className="mt-2">
                        Add First Lesson
                      </Button>
                    </div>
                  )}
                  {/* Lesson List */}
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <Video className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                        <div className="md:col-span-2 space-y-2">
                          <Input
                            value={lesson.title}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((s) =>
                                  s.id === module.id
                                    ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id ? { ...l, title: e.target.value } : l
                                      ),
                                    }
                                    : s
                                )
                              )
                            }
                            placeholder="Lesson title"
                          />
                          <Input
                            value={lesson.description}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((s) =>
                                  s.id === module.id
                                    ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id ? { ...l, description: e.target.value } : l
                                      ),
                                    }
                                    : s
                                )
                              )
                            }
                            placeholder="Lesson description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Video File</Label>
                          <Input type="file" accept="video/*" onChange={(e) => handleVideoUpload(module.id, lesson.id, e)} />
                          {lesson.videoFile && (
                            <p className="text-sm text-muted-foreground">
                              {typeof lesson.videoFile === 'string'
                                ? lesson.videoFile.split('/').pop()
                                : lesson.videoFile.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Thumbnail</Label>
                          <Input type="file" accept="image/*" onChange={(e) => handleThumbnailUpload(module.id, lesson.id, e)} />
                          {lesson.thumbnail && (
                            <img
                              src={typeof lesson.thumbnail === 'string' ? lesson.thumbnail : URL.createObjectURL(lesson.thumbnail)}
                              alt="Lesson thumbnail"
                              className="max-w-[100px] rounded-md object-cover"
                              style={{ aspectRatio: '16/9' }}
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((s) =>
                                  s.id === module.id
                                    ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id
                                          ? { ...l, duration: parseInt(e.target.value) || 0 }
                                          : l
                                      ),
                                    }
                                    : s
                                )
                              )
                            }
                            placeholder="Duration"
                            className="w-20"
                          />
                          <span className="text-xs text-muted-foreground">min</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-1 text-sm">
                          <input
                            type="checkbox"
                            checked={lesson.isFree}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((s) =>
                                  s.id === module.id
                                    ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id ? { ...l, isFree: e.target.checked } : l
                                      ),
                                    }
                                    : s
                                )
                              )
                            }
                          />
                          <span>Free</span>
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModules((prev) =>
                              prev.map((s) =>
                                s.id === module.id
                                  ? { ...s, lessons: s.lessons.filter((l) => l.id !== lesson.id) }
                                  : s
                              )
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Thumbnail Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Thumbnail</h3>
              <Button variant="ghost" onClick={handleCancelCrop}>
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
              <Button onClick={handleCrop}>Crop & Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
