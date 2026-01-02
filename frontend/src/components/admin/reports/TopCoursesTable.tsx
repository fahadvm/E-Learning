
interface TopCourse {
    title: string;
    sales: number;
    revenue: number;
}

interface TopCoursesTableProps {
    data: TopCourse[];
}

export default function TopCoursesTable({ data }: TopCoursesTableProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Courses</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                            <th className="pb-3 font-medium">Course Title</th>
                            <th className="pb-3 font-medium">Sales</th>
                            <th className="pb-3 font-medium">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.map((course, index) => (
                            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                <td className="py-3 font-medium text-gray-800">{course.title}</td>
                                <td className="py-3 text-gray-600">{course.sales}</td>
                                <td className="py-3 text-gray-600">₹{course.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
