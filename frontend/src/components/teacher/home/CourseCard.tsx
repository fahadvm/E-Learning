'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageCircle,
  Plus,
  Play,
  Star,
  ChevronRight,
  Eye,
  Edit,
} from 'lucide-react';
import Header from '@/components/teacher/header';

// Mock data - in a real app, this would come from an API
const teacherData = {
  name: 'Sarah Wilson',
  totalStudents: 1247,
  totalCourses: 5,
  monthlyRevenue: 4850,
  avgRating: 4.8,
  courses: [
    {
      id: '1',
      title: 'Advanced React Development',
      students: 523,
      rating: 4.9,
      revenue: 2100,
      status: 'published',
      lastUpdated: '2 days ago',
    },
    {
      id: '2',
      title: 'Node.js Backend Mastery',
      students: 412,
      rating: 4.7,
      revenue: 1650,
      status: 'published',
      lastUpdated: '1 week ago',
    },
    {
      id: '3',
      title: 'Full Stack JavaScript',
      students: 312,
      rating: 4.8,
      revenue: 1100,
      status: 'published',
      lastUpdated: '3 days ago',
    },
    {
      id: '4',
      title: 'TypeScript Fundamentals',
      students: 0,
      rating: 0,
      revenue: 0,
      status: 'draft',
      lastUpdated: '1 hour ago',
    },
  ],
  upcomingClasses: [
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      courseId: '1',
      startTime: '2024-08-20T14:00:00Z',
      duration: 90,
      registeredStudents: 45,
    },
    {
      id: '2',
      title: 'API Design Best Practices',
      courseId: '2',
      startTime: '2024-08-21T16:30:00Z',
      duration: 60,
      registeredStudents: 32,
    },
  ],
  recentMessages: [
    {
      id: '1',
      studentName: 'John Doe',
      message: 'Hi Sarah, I have a question about the useEffect hook...',
      timestamp: '5 min ago',
      unread: true,
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      message: 'Thank you for the excellent explanation on async/await!',
      timestamp: '2 hours ago',
      unread: false,
    },
  ],
  analytics: {
    studentsThisWeek: 23,
    revenueThisMonth: 4850,
    completionRate: 78,
    averageRating: 4.8,
  },
};

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
              Welcome back, {teacherData.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and engage with students
            </p>
          </div>
          <Button asChild data-testid="button-create-course">
            <Link href="/teacher/create-course">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-students">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherData.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{teacherData.analytics.studentsThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-active-courses">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherData.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                1 draft in progress
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-monthly-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${teacherData.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-average-rating">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {teacherData.avgRating}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
              </div>
              <p className="text-xs text-muted-foreground">
                From 1,247 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Management */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Courses</CardTitle>
                  <Button variant="ghost" size="sm" asChild data-testid="button-view-all-courses">
                    <Link href="/teacher/courses">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Manage and track your course performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherData.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    data-testid={`course-card-${course.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {course.students} students
                          </span>
                          {course.rating > 0 && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm text-muted-foreground">{course.rating}</span>
                            </div>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            course.status === 'published' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {course.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Updated {course.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-sm font-medium">${course.revenue}</div>
                        <div className="text-xs text-muted-foreground">revenue</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid={`button-view-${course.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" data-testid={`button-edit-${course.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2"
                asChild
                data-testid="button-create-course-action"
              >
                <Link href="/teacher/create-course">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Create Course</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2"
                asChild
                data-testid="button-schedule-class"
              >
                <Link href="/teacher/schedule-class">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule Class</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2"
                asChild
                data-testid="button-messages"
              >
                <Link href="/teacher/messages">
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-sm">Messages</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2"
                asChild
                data-testid="button-analytics"
              >
                <Link href="/teacher/analytics">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Live Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherData.upcomingClasses.map((liveClass) => (
                  <div
                    key={liveClass.id}
                    className="p-3 border rounded-lg"
                    data-testid={`live-class-${liveClass.id}`}
                  >
                    <h4 className="font-medium text-sm">{liveClass.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {liveClass.registeredStudents} students registered
                    </p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">
                        Aug 20, 2:00 PM
                      </span>
                      <span className="text-muted-foreground">
                        {liveClass.duration}m
                      </span>
                    </div>
                    <Button size="sm" className="w-full" data-testid={`button-start-${liveClass.id}`}>
                      <Play className="h-3 w-3 mr-1" />
                      Start Class
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild data-testid="button-view-all-classes">
                  <Link href="/teacher/live-classes">View All Classes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teacherData.recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 border rounded-lg ${message.unread ? 'border-primary/50 bg-primary/5' : ''}`}
                    data-testid={`message-${message.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{message.studentName}</p>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                    {message.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild data-testid="button-view-all-messages">
                  <Link href="/teacher/messages">View All Messages</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Course Completion Rate</span>
                    <span>{teacherData.analytics.completionRate}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${teacherData.analytics.completionRate}%` }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      +{teacherData.analytics.studentsThisWeek}
                    </div>
                    <div className="text-xs text-muted-foreground">New Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      ${teacherData.analytics.revenueThisMonth.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}