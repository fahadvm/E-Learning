'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/componentssss/ui/button';
import { Card, CardContent, CardHeader } from '@/componentssss/ui/card';
import { Input } from '@/componentssss/ui/input';
import { Label } from '@/componentssss/ui/label';
import { BookOpen, Plus, Trash2, Video, Upload, X } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  type: 'video';
  duration: number;
  isFree: boolean;
  videoFile: File | null;
  thumbnail: File | null;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

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

  // Add a new module
  const addModule = () => {
    const newModule: CourseModule = {
      id: Date.now().toString(),
      title: 'New Module',
      lessons: [],
    };
    setModules(prev => [...prev, newModule]);
  };

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
        alert('Please upload a video file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('Video size must be less than 100MB');
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
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
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
        alert('Failed to crop thumbnail. Please try again.');
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
        <Button onClick={addModule} data-testid="button-add-module">
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <Card key={module.id} data-testid={`module-${module.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Input
                  value={module.title}
                  onChange={(e) =>
                    setModules(prev =>
                      prev.map(s => (s.id === module.id ? { ...s, title: e.target.value } : s))
                    )
                  }
                  className="text-lg font-medium border-0 p-0 h-auto bg-transparent"
                  data-testid={`input-module-title-${module.id}`}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(module.id)}
                    data-testid={`button-add-lesson-${module.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                  {modules.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModules(prev => prev.filter(s => s.id !== module.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                    data-testid={`lesson-${lesson.id}`}
                  >
                    <div className="flex-shrink-0">
                      <Video className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                      <div className="md:col-span-2 space-y-2">
                        <Input
                          value={lesson.title}
                          onChange={(e) =>
                            setModules(prev =>
                              prev.map(s =>
                                s.id === module.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map(l =>
                                        l.id === lesson.id ? { ...l, title: e.target.value } : l
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                          placeholder="Lesson title"
                          data-testid={`input-lesson-title-${lesson.id}`}
                        />
                        <Input
                          value={lesson.description}
                          onChange={(e) =>
                            setModules(prev =>
                              prev.map(s =>
                                s.id === module.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map(l =>
                                        l.id === lesson.id ? { ...l, description: e.target.value } : l
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                          placeholder="Lesson description"
                          data-testid={`input-lesson-description-${lesson.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Video File</Label>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(module.id, lesson.id, e)}
                          className="text-sm"
                          data-testid={`input-video-${lesson.id}`}
                        />
                        {lesson.videoFile && (
                          <p className="text-sm text-muted-foreground">{lesson.videoFile.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleThumbnailUpload(module.id, lesson.id, e)}
                          className="text-sm"
                          data-testid={`input-thumbnail-${lesson.id}`}
                        />
                        {lesson.thumbnail && (
                          <img
                            src={URL.createObjectURL(lesson.thumbnail)}
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
                            setModules(prev =>
                              prev.map(s =>
                                s.id === module.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map(l =>
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
                          data-testid={`input-duration-${lesson.id}`}
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
                            setModules(prev =>
                              prev.map(s =>
                                s.id === module.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map(l =>
                                        l.id === lesson.id ? { ...l, isFree: e.target.checked } : l
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                          data-testid={`checkbox-free-${lesson.id}`}
                        />
                        <span>Free</span>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setModules(prev =>
                            prev.map(s =>
                              s.id === module.id
                                ? { ...s, lessons: s.lessons.filter(l => l.id !== lesson.id) }
                                : s
                            )
                          )
                        }
                        data-testid={`button-delete-lesson-${lesson.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {module.lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No lessons in this module yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(module.id)}
                      className="mt-2"
                      data-testid={`button-add-first-lesson-${module.id}`}
                    >
                      Add First Lesson
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Thumbnail</h3>
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
    </div>
  );
}
