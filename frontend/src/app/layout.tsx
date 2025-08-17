import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { CourseProvider } from '@/context/CourseContext';

export const metadata = {
  title: "DevNext",
  description: " e-learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <CourseProvider>{children}</CourseProvider>
      </body>
    </html>
  );
}
