import { z } from "zod";

/* ================= COMMON ================= */

const PHONE_REGEX = /^\d{10}$/;
const URL_REGEX =
  /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.+)?$/;

/* ================= PROFILE ================= */

export const employeeProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .regex(PHONE_REGEX, "Enter valid 10-digit phone number")
    .optional()
    .or(z.literal("")),

  location: z.string().optional(),

  about: z.string().max(500, "About cannot exceed 500 characters").optional(),

  social_links: z
    .object({
      linkedin: z.string().regex(URL_REGEX, "Invalid LinkedIn URL").optional().or(z.literal("")),
      github: z.string().regex(URL_REGEX, "Invalid GitHub URL").optional().or(z.literal("")),
      portfolio: z.string().regex(URL_REGEX, "Invalid Portfolio URL").optional().or(z.literal("")),
    })
    .optional(),
});

export type EmployeeProfileForm = z.infer<typeof employeeProfileSchema>;

/* ================= EMAIL ================= */

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .optional(),
});

/* ================= PASSWORD ================= */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain upper, lower, number & special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
