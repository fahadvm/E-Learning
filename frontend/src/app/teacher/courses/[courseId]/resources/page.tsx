import CourseResourcesForm from "@/components/teacher/course/resources/CourseResourcesForm";

interface Props {
  params: { courseId: string };
}

export default function CourseResourcesPage({ params }: Props) {
  const { courseId } = params;
  console.log("params:", courseId)
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Resources</h1>
      <CourseResourcesForm courseId={courseId} />
    </div>
  );
}
