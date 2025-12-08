'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BookOpen,
  Upload,
  Plus,
  Trash2,
//   DragHandle,
  FileText,
  Video,
  Code,
//   Quiz,
  Save,
  Eye,
  ArrowLeft,
  Settings,
  Globe,
  DollarSign,
  Clock,
  Users,
  Tags,
} from 'lucide-react';

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'code' | 'quiz';
  duration: number; // in minutes
  isFree: boolean;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: 'Beginner',
    language: 'English',
    price: 0,
    currency: 'USD',
    thumbnail: '',
    tags: [] as string[],
    learningOutcomes: [''],
    requirements: [''],
    isPublished: false,
    allowDiscounts: true,
  });
  
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: '1',
      title: 'Introduction',
      lessons: [
        {
          id: '1',
          title: 'Welcome to the Course',
          description: 'Course overview and what you\'ll learn',
          type: 'video',
          duration: 5,
          isFree: true,
        }
      ]
    }
  ]);

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'Machine Learning',
    'Backend Development',
    'DevOps',
    'Database',
    'UI/UX Design',
    'Game Development',
    'Cybersecurity'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Mandarin', 'Japanese'];

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Course details and metadata' },
    { number: 2, title: 'Curriculum', description: 'Structure your course content' },
    { number: 3, title: 'Pricing & Settings', description: 'Set price and publish options' },
    { number: 4, title: 'Review & Publish', description: 'Review and publish your course' },
  ];

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addLearningOutcome = () => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, '']
    }));
  };

  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const addSection = () => {
    const newSection: CourseSection = {
      id: Date.now().toString(),
      title: 'New Section',
      lessons: []
    };
    setSections(prev => [...prev, newSection]);
  };

  const addLesson = (sectionId: string) => {
    const newLesson: CourseLesson = {
      id: Date.now().toString(),
      title: 'New Lesson',
      description: '',
      type: 'video',
      duration: 10,
      isFree: false
    };
    
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: [...section.lessons, newLesson] }
        : section
    ));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => 
        i === index ? value : outcome
      )
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => 
        i === index ? value : req
      )
    }));
  };

  const getTotalDuration = () => {
    return sections.reduce((total, section) => 
      total + section.lessons.reduce((sectionTotal, lesson) => 
        sectionTotal + lesson.duration, 0
      ), 0
    );
  };

  const getTotalLessons = () => {
    return sections.reduce((total, section) => total + section.lessons.length, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate course creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would make an API call to create the course
    console.log('Course Data:', courseData);
    console.log('Course Sections:', sections);
    
    setIsSubmitting(false);
    router.push('/teacher/my-courses');
  };

  const renderBasicInformation = () => (
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
                  <option key={category} value={category}>{category}</option>
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
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
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
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Course Thumbnail</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Upload course thumbnail (16:9 ratio recommended)</p>
              <Button variant="outline" size="sm" className="mt-2" data-testid="button-upload-thumbnail">
                Choose File
              </Button>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
                      onClick={() => setCourseData(prev => ({
                        ...prev,
                        learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
                      }))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addLearningOutcome} data-testid="button-add-outcome">
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
                      onClick={() => setCourseData(prev => ({
                        ...prev,
                        requirements: prev.requirements.filter((_, i) => i !== index)
                      }))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addRequirement} data-testid="button-add-requirement">
                <Plus className="h-4 w-4 mr-2" />
                Add Prerequisite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Curriculum</h3>
          <p className="text-sm text-muted-foreground">
            {getTotalLessons()} lessons • {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m total
          </p>
        </div>
        <Button onClick={addSection} data-testid="button-add-section">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} data-testid={`section-${section.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Input
                  value={section.title}
                  onChange={(e) => setSections(prev => prev.map(s => 
                    s.id === section.id ? { ...s, title: e.target.value } : s
                  ))}
                  className="text-lg font-medium border-0 p-0 h-auto bg-transparent"
                  data-testid={`input-section-title-${section.id}`}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(section.id)}
                    data-testid={`button-add-lesson-${section.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                  {sections.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSections(prev => prev.filter(s => s.id !== section.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.lessons.map((lesson, ) => (
                  <div
                    key={lesson.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                    data-testid={`lesson-${lesson.id}`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.type === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                      {lesson.type === 'text' && <FileText className="h-5 w-5 text-green-500" />}
                      {lesson.type === 'code' && <Code className="h-5 w-5 text-purple-500" />}
                      {/* {lesson.type === 'quiz' && <Quiz className="h-5 w-5 text-orange-500" />} */}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={lesson.title}
                        onChange={(e) => setSections(prev => prev.map(s => 
                          s.id === section.id 
                            ? {
                                ...s,
                                lessons: s.lessons.map(l => 
                                  l.id === lesson.id ? { ...l, title: e.target.value } : l
                                )
                              }
                            : s
                        ))}
                        placeholder="Lesson title"
                        className="md:col-span-2"
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) => setSections(prev => prev.map(s => 
                          s.id === section.id 
                            ? {
                                ...s,
                                lessons: s.lessons.map(l => 
                                  l.id === lesson.id ? { ...l, type: e.target.value as any } : l
                                )
                              }
                            : s
                        ))}
                        className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="video">Video</option>
                        <option value="text">Article</option>
                        <option value="code">Coding Exercise</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => setSections(prev => prev.map(s => 
                            s.id === section.id 
                              ? {
                                  ...s,
                                  lessons: s.lessons.map(l => 
                                    l.id === lesson.id ? { ...l, duration: parseInt(e.target.value) || 0 } : l
                                  )
                                }
                              : s
                          ))}
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
                          onChange={(e) => setSections(prev => prev.map(s => 
                            s.id === section.id 
                              ? {
                                  ...s,
                                  lessons: s.lessons.map(l => 
                                    l.id === lesson.id ? { ...l, isFree: e.target.checked } : l
                                  )
                                }
                              : s
                          ))}
                        />
                        <span>Free</span>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSections(prev => prev.map(s => 
                          s.id === section.id 
                            ? { ...s, lessons: s.lessons.filter(l => l.id !== lesson.id) }
                            : s
                        ))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {section.lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No lessons in this section yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(section.id)}
                      className="mt-2"
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
    </div>
  );

  const renderPricingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
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
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <Input
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="flex-1"
                data-testid="input-course-price"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowDiscounts"
                checked={courseData.allowDiscounts}
                onChange={(e) => setCourseData(prev => ({ ...prev, allowDiscounts: e.target.checked }))}
              />
              <Label htmlFor="allowDiscounts" className="text-sm">
                Allow promotional discounts
              </Label>
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
                ? "Your course will be live and visible to students immediately"
                : "Your course will be saved as a draft"
              }
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
              <span>{Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{getTotalLessons()} lessons</span>
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

  const renderReviewPublish = () => (
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
                <BookOpen className="h-8 w-8 text-primary opacity-50" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{courseData.title || 'Course Title'}</h3>
                <p className="text-muted-foreground mt-1">{courseData.subtitle || 'Course subtitle'}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {courseData.level}
                  </span>
                  <span>{courseData.category}</span>
                  <span>{Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m</span>
                  <span>{getTotalLessons()} lessons</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold">
                    {courseData.price > 0 ? `$${courseData.price}` : 'Free'}
                  </div>
                  <Button>Enroll Now</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready to Publish?</CardTitle>
          <CardDescription>
            Make sure all information is correct before publishing your course
          </CardDescription>
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
                  <li className={sections.length > 0 ? 'text-green-600' : 'text-red-600'}>
                    {sections.length > 0 ? '✓' : '✗'} Sections created ({sections.length})
                  </li>
                  <li className={getTotalLessons() > 0 ? 'text-green-600' : 'text-red-600'}>
                    {getTotalLessons() > 0 ? '✓' : '✗'} Lessons added ({getTotalLessons()})
                  </li>
                  <li className={getTotalDuration() >= 30 ? 'text-green-600' : 'text-orange-600'}>
                    {getTotalDuration() >= 30 ? '✓' : '!'} Course duration ({Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m)
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
                    : 'This course will be saved as a draft and can be published later'
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return courseData.title && courseData.description && courseData.category;
      case 2:
        return sections.length > 0 && getTotalLessons() > 0;
      case 3:
        return courseData.price >= 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Create New Course</h1>
              <p className="text-muted-foreground">Step {currentStep} of 4: {steps[currentStep - 1].title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" data-testid="button-save-draft">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" data-testid="button-preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-4xl">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {step.number}
              </div>
              <div className="ml-3 hidden md:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-24 h-0.5 ml-8 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && renderBasicInformation()}
            {currentStep === 2 && renderCurriculum()}
            {currentStep === 3 && renderPricingSettings()}
            {currentStep === 4 && renderReviewPublish()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            data-testid="button-previous-step"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                data-testid="button-next-step"
              >
                Next: {steps[currentStep]?.title}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                data-testid="button-create-course"
              >
                {isSubmitting ? 'Creating Course...' : 
                 courseData.isPublished ? 'Create & Publish Course' : 'Create Course Draft'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}