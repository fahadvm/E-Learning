
# DevNext - Advanced E-Learning Platform 

DevNext is a state-of-the-art, multi-role E-learning & Corporate Training ecosystem designed to provide a seamless educational
experience for students, teachers, companies, and employees. Built with a focus on modern UI/UX, real-time interactivity, 
and AI-driven features, it represents the next generation of online learning.

---

## 🚀 Key Features

### 👥 Multi-Role Ecosystem
- **Admin Dashboard**: Comprehensive management of users, courses, and platform analytics.
- **Teacher Portal**: Robust tools for course creation, student management, and performance tracking.
- **Student Experience**: Personalized learning paths, progress tracking, and interactive course content.
- **Company & Employee Tiers**: B2B features allowing companies to manage employee training and subscriptions.

### 💳 Seamless Payments & Subscriptions
- **Dual Gateway Support**: Integrated with **Stripe** and **Razorpay** for global and local transactions.
- **Tiered Subscriptions**: Flexible Standard and Premium plans for students and corporate entities.
- **Automated Invoicing**: Dynamic PDF generation for all financial transactions.

### 🤖 AI-Powered Learning
- **Smart Assistance**: Leveraging **OpenAI** and **Google Gemini** for course generation and student support.
- **Automated Assessments**: AI-driven evaluation and feedback mechanisms.

### ⚡ Real-Time Interactivity
- **Live Notifications**: Instant updates via **Socket.io**.
- **Interactive Coding**: Integrated **Judge0 API** for real-time code execution and validation.

### 🎨 Premium UI/UX
- **Modern Stack**: Built with **Next.js 15** and **Tailwind CSS**.
- **Dynamic Visuals**: Stunning animations using **Framer Motion**, **GSAP**, and **Vanta.js**.
- **Data Visualization**: Clear insights through **Chart.js** and **Recharts**.

---

## 🛠️ Technologies Used

### Frontend
- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS, Shadcn UI, Ant Design
- **State Management**: Zustand, context API, TanStack Query (React Query)
- **Animations**: Framer Motion, GSAP, Three.js, Vanta.js
- **Icons**: Lucide React, FontAwesome

### Backend
- **Runtime**: Node.js
- **Framework**: Express with TypeScript
- **Database**: MongoDB (Mongoose), Redis (Caching)
- **Architecture**: Clean/Layered Architecture with Inversify (Dependency Injection)
- **Communication**: Socket.io

### Third-Party Services
- **Payments**: Stripe, Razorpay
- **Storage**: Cloudinary
- **AI**: OpenAI API, Google Generative AI
- **Email**: Nodemailer
- **Utilities**: PDFKit, Judge0

---

## 📂 Folder Structure

```text
E-Learning/
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/           # App Router (Admin, Student, Teacher, Company, Employee)
│   │   ├── components/    # Reusable UI Components
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── store/         # Zustand Store
│   │   └── services/      # API Integration Layers
│   └── public/            # Static Assets
│
└── backend/                # Express Server
    ├── src/
    │   ├── core/          # Interfaces & Abstractions
    │   ├── controllers/   # Request Handlers
    │   ├── services/      # Business Logic Layer
    │   ├── repositories/  # Data Access Layer
    │   ├── models/        # Mongoose Schemas
    │   ├── routes/        # API Endpoints
    │   └── middleware/    # Auth & Validation Middleware
    └── Dockerfile          # Containerization Setup
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v20+)
- MongoDB
- Redis

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and populate it using the template below.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and populate it.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_API_KEY=your_google_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
REDIS_URL=your_redis_url
JUDGE0_API_KEY=your_judge0_key
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000/api
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_public_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

---

## 🛣️ API Endpoints (Highlights)

| Method | Endpoint | Description |
| :---   | :---     | :---        |
| `POST` | `/api/auth/student/login` | Student Login |
| `GET` | `/api/student/courses` | Fetch all courses for student |
| `POST` | `/api/teacher/course/create` | Create a new course |
| `POST` | `/api/company/subscription` | Purchase company subscription |
| `GET` | `/api/admin/users` | Manage platform users |

---

## 📸 Screenshots

<img width="1866" height="946" alt="image" src="https://github.com/user-attachments/assets/fdf8c0fe-d254-44b1-acf4-e8b8ffe42247" />

---

## 💡 Key Learnings & Highlights

- **Scalable Architecture**: Implementation of a decoupled layered architecture on the backend ensures high maintainability.
- **Advanced State Management**: Efficiently handling complex multi-role states using Zustand and TanStack Query.
- **High Performance UI**: Optimizing heavy animations and 3D elements (Three.js/Vanta) for a smooth user experience.
- **Financial Integrity**: Secure handling of multi-currency payments across different regions.

---

## 🔗 Links
- **Live Demo**: [devnext.online](https://devnext.online)
---

Developed by Fahad VM
