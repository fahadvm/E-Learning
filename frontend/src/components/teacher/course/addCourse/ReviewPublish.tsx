
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe } from 'lucide-react';

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

interface CourseData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: number;
  currency: string;
  coverImage: File | null;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  isPublished: boolean;
  allowDiscounts: boolean;
}

interface ReviewPublishProps {
  courseData: CourseData;
  modules: CourseModule[];
  totalDuration: number;
  totalLessons: number;
}

export default function ReviewPublish({ courseData, modules, totalDuration, totalLessons }: ReviewPublishProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Preview</CardTitle>
          <CardDescription>This is how your course will appear to students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-secondary/20">
            <div className="flex items-start space-x-4">
              <div className="w-32 h-20 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                {courseData.coverImage ? (
                  <img
                    src={URL.createObjectURL(courseData.coverImage)}
                    alt="Course cover image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="h-8 w-8 text-primary opacity-50" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{courseData.title || 'Course Title'}</h3>
                <p className="text-muted-foreground mt-1">{courseData.subtitle || 'Course subtitle'}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {courseData.level}
                  </span>
                  <span>{courseData.category}</span>
                  <span>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold">
                    {courseData.price > 0 ? `${courseData.currency} ${courseData.price}` : 'Free'}
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready to Publish?</CardTitle>
          <CardDescription>Make sure all information is correct before publishing your course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Course Information</h4>
                <ul className="text-sm space-y-1">
                  <li className={courseData.title ? 'text-green-600' : 'text-red-600'}>
                    {courseData.title ? '✓' : '✗'} Course title
                  </li>
                  <li className={courseData.description ? 'text-green-600' : 'text-red-600'}>
                    {courseData.description ? '✓' : '✗'} Course description
                  </li>
                  <li className={courseData.category ? 'text-green-600' : 'text-red-600'}>
                    {courseData.category ? '✓' : '✗'} Category selected
                  </li>
                  <li className={courseData.tags.length > 0 ? 'text-green-600' : 'text-orange-600'}>
                    {courseData.tags.length > 0 ? '✓' : '!'} Tags added ({courseData.tags.length})
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Course Content</h4>
                <ul className="text-sm space-y-1">
                  <li className={modules.length > 0 ? 'text-green-600' : 'text-red-600'}>
                    {modules.length > 0 ? '✓' : '✗'} Modules created ({modules.length})
                  </li>
                  <li className={totalLessons > 0 ? 'text-green-600' : 'text-red-600'}>
                    {totalLessons > 0 ? '✓' : '✗'} Lessons added ({totalLessons})
                  </li>
                  <li className={totalDuration >= 30 ? 'text-green-600' : 'text-orange-600'}>
                    {totalDuration >= 30 ? '✓' : '!'} Course duration (
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m)
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>
                  {courseData.isPublished
                    ? 'This course will be published immediately and visible to all students'
                    : 'This course will be saved as a draft and can be published later'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
