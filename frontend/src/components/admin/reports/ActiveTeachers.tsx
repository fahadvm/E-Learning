
interface ActiveTeachersProps {
    data: any[];
}

export default function ActiveTeachers({ data }: ActiveTeachersProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Most Active Teachers</h3>
            <div className="space-y-4">
                {data.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">{teacher.name}</p>
                            <p className="text-xs text-gray-500">{teacher.transactions} Sales</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-blue-600">₹{teacher.revenue}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
