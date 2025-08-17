'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CourseInfo {
  courseName: string;
  courseDescription: string;
  courseLevel: string;
  courseCategory: string;
  price: string;
  coverImage: File | null;
}

interface CourseContextType {
  courseInfo: CourseInfo;
  setCourseInfo: (info: CourseInfo) => void;
}

const defaultState: CourseContextType = {
  courseInfo: {
    courseName: '',
    courseDescription: '',
    courseLevel: 'Beginner',
    courseCategory: 'Design',
    price: '',
    coverImage: null,
  },
  setCourseInfo: () => {},
};

const CourseContext = createContext<CourseContextType>(defaultState);

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courseInfo, setCourseInfo] = useState<CourseInfo>(defaultState.courseInfo);

  return (
    <CourseContext.Provider value={{ courseInfo, setCourseInfo }}>
      {children}
    </CourseContext.Provider>
  );
};
