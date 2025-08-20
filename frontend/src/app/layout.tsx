import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CourseProvider } from '@/context/CourseContext';
import { ThemeProvider ,QueryProvider } from "@/lib/provider";

export const metadata = {
  title: "DevNext",
  description: " e-learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>
            <CourseProvider>{children}
              <ToastContainer />
            </CourseProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
