import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; 
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { useEffect } from "react";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { Clock,CheckCircle } from "lucide-react";
export default async function Dashboard() {
  const {userId} = auth();
  if(!userId)
    return redirect("/");
  const {
    completedCourses,
    courseInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
     <InfoCard
        icon={Clock}
        label="In Progress"
        numberOfItems={courseInProgress.length}
     />
     <InfoCard
        icon={CheckCircle}
        label="Completed"
        numberOfItems={completedCourses.length}
        variant="success"
     />
    </div>
    <CoursesList
      items={[...courseInProgress, ...completedCourses]}
    />
  </div>
  );
}
