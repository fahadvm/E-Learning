import { z } from "zod";

// Social Links Schema
const socialLinksSchema = z.object({
  linkedin: z.url({ message: "Invalid LinkedIn URL" }).optional(),
  twitter: z.url({ message: "Invalid Twitter URL" }).optional(),
  instagram: z.url({ message: "Invalid Instagram URL" }).optional(),
}).optional();

// Education Schema
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startYear: z.string().min(4, "Start year is required"),
  endYear: z.string().min(4, "End year is required"),
});

// Experience Schema
const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().min(4, "End date is required"),
});

// Main Teacher Profile Schema
export const TeacherProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.url({ message: "Invalid website URL" }).optional(),
  about: z.string().max(500, "Maximum 500 characters").optional(),
  profilePicture: z.url({ message: "Invalid image URL" }).optional(),
  skills: z.array(z.string().min(1)).optional(),

  social_links: socialLinksSchema,
  education: z.array(educationSchema).optional(),
  experiences: z.array(experienceSchema).optional(),
});
