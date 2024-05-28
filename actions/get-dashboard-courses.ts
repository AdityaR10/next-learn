import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { use } from "react";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters:Chapter[];
    progress:number | null;
}
type DashboardCourses = {
    completedCourses : CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId:string) : Promise<DashboardCourses> => {
    try{
        const PurchasesCourses = await db.purchase.findMany({
            where : {
                userId : userId,
            },
            select : {
                 course : {
                    include : {
                        category : true,
                        chapters: {
                            where : {
                                isPublished:true,
                            }
                        }
                    }
                 }
            }
        });
        const courses = PurchasesCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];
        for(let course of courses) {
            const progress = await getProgress(userId,course.id);
            course["progress"] = progress;
        }
        const completedCourses = courses.filter((course) => course.progress === 100);
        const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100);
        return {
            completedCourses,
            courseInProgress
        }
    } catch (err){
        console.log("[GET_DASHBOARD_COURSES]",err);
        return {
            completedCourses : [],
            courseInProgress: []
        }
    }
}