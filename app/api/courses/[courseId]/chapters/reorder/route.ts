import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { use } from "react";
export async function PUT(req:Request,
    {params}:{params:{courseId:string}}) {
    try{
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        const {list} = await req.json();
        const ownCourse = await db.course.findUnique({
            where: {
                id:params.courseId,
                userId:userId,
            }
        });
        if(!ownCourse)
            return new NextResponse("Unauthorized",{status:401});

            for(let item of list){
                await db.chapter.update({
                    where:{
                        id:item.id,
                    },
                    data:{
                        position:item.position,
                    }
                });
            }
            return new NextResponse("Success",{status:200});
    } catch(err) {
        console.log("REORDER",err);
        return new NextResponse("Internal error",{status:500});
    }
}