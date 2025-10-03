
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee, Settings, Clock, BookOpen, Users, Tags } from 'lucide-react';

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
  totalDuration: number;
}

interface PricingSettingsProps {
  courseData: CourseData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseData>>;
  totalDuration: number;
  totalLessons: number;
}

export default function PricingSettings({ courseData, setCourseData, totalDuration, totalLessons }: PricingSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Pricing
            </CardTitle>
            <CardDescription>Set your course price and currency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <select
                value={courseData.currency}
                onChange={(e) => setCourseData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-20 h-10 px-3 rounded-md border border-input bg-background text-sm"
                data-testid="select-currency"
              >
                <option value="INR">INR</option>
              </select>
              <Input
                type="number"
                value={courseData.price}
                onChange={(e) =>
                  setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                }
                placeholder="0.00"
                className="flex-1"
                data-testid="input-course-price"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Publishing Settings
            </CardTitle>
            <CardDescription>Control how your course is published</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={courseData.isPublished}
                onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))}
                data-testid="checkbox-publish-course"
              />
              <Label htmlFor="isPublished" className="text-sm">
                Publish course immediately
              </Label>
            </div>
            <div className="text-sm text-muted-foreground">
              {courseData.isPublished
                ? 'Your course will be live and visible to students immediately'
                : 'Your course will be saved as a draft'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Summary</CardTitle>
          <CardDescription>Review your course details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{courseData.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tags className="h-4 w-4 text-muted-foreground" />
              <span>{courseData.tags.length} tags</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
