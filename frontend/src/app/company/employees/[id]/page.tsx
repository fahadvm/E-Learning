export default function EmployeeProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Employee Profile</h1>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Card */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Employee"
                className="h-36 w-36 rounded-full object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">John Doe</h2>
              <p className="text-sm text-gray-500">Software Engineer</p>
              <span className="mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-700">Email:</span> john.doe@company.com</p>
              <p><span className="font-medium text-gray-700">Phone:</span> +91 98765 43210</p>
              <p><span className="font-medium text-gray-700">Location:</span> Bangalore, India</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                John is a skilled software engineer with experience in building scalable web
                applications using modern technologies like React, Next.js, and Node.js.
              </p>
            </div>

            {/* Work Info */}
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Work Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-gray-500">Employee ID</p>
                  <p className="font-medium text-gray-800">EMP-1023</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">Engineering</p>
                </div>
                <div>
                  <p className="text-gray-500">Joining Date</p>
                  <p className="font-medium text-gray-800">12 Jan 2024</p>
                </div>
                <div>
                  <p className="text-gray-500">Role</p>
                  <p className="font-medium text-gray-800">Frontend Developer</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'].map(skill => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
