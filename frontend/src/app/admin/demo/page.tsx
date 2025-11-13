// "use client"


// import { useState } from 'react';

// const mockStudents = [
//   {
//     id: 1,
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     course: 'React Fundamentals',
//     enrollmentDate: '2023-01-15',
//     subscription: 85,
//     status: 'Active',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     id: 2,
//     name: 'Bob Smith',
//     email: 'bob@example.com',
//     course: 'Advanced JavaScript',
//     enrollmentDate: '2023-02-20',
//     subscription: 92,
//     status: 'Active',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   {
//     id: 3,
//     name: 'Charlie Brown',
//     email: 'charlie@example.com',
//     course: 'Python for Beginners',
//     enrollmentDate: '2023-03-10',
//     subscription: 60,
//     status: 'Inactive',
//     avatar: 'https://via.placeholder.com/40',
//   },
//   // Add more mock data as needed
// ];

// export default function Students() {
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = (student) => {
//     setSelectedStudent(student);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedStudent(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="px-6 py-4 bg-gray-800 text-white">
//             <h1 className="text-2xl font-bold">Student Management</h1>
//             <p className="text-gray-300">View and manage enrolled students</p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Course
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     subscription
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {mockStudents.map((student) => (
//                   <tr key={student.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                           <div className="text-sm text-gray-500">{student.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900"></div>
//                       <div className="text-sm text-gray-500">count: 13</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                           <div 
//                             className="bg-blue-600 h-2.5 rounded-full" 
//                             style={{ width: `${student.subscription}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-sm text-gray-900">{student.subscription}%</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         student.status === 'Active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {student.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button 
//                         onClick={() => openModal(student)}
//                         className="text-indigo-600 hover:text-indigo-900 mr-4"
//                       >
//                         View Details
//                       </button>
                      
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Student Details */}
//       {isModalOpen && selectedStudent && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex items-center justify-center">
//                 <img className="h-20 w-20 rounded-full" src={selectedStudent.avatar} alt="" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 text-center mt-4">{selectedStudent.name}</h3>
//               <div className="mt-4">
//                 <p className="text-sm text-gray-500"><strong>Email:</strong> {selectedStudent.email}</p>
//                 <p className="text-sm text-gray-500"><strong>Course:</strong> {selectedStudent.course}</p>
//                 <p className="text-sm text-gray-500"><strong>Enrollment Date:</strong> {selectedStudent.enrollmentDate}</p>
//                 <p className="text-sm text-gray-500"><strong>subscription:</strong> {selectedStudent.subscription}%</p>
//                 <p className="text-sm text-gray-500"><strong>Status:</strong> {selectedStudent.status}</p>
//               </div>
//               <div className="flex items-center px-4 py-3">
//                 <button 
//                   onClick={closeModal}
//                   className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
