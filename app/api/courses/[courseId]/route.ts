import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { Amiri_Quran } from "next/font/google";
import { isTeacher } from "@/lib/teacher";
import { use } from "react";

const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
  });

export async function DELETE(req:Request,
    { params }: {params : {courseId:string}}) {
        try{
            const {userId} = auth();
            if(!userId || !isTeacher(userId)){
                return new NextResponse("Unauthorized",{status:401});
            }

            const course = await db.course.findUnique({
                where:{
                    id:params.courseId,
                    userId:userId,
                },
                include:{
                    chapters:{
                        include:{
                            muxData:true
                        }
                    }
                }
            });
            if(!course){
                return new NextResponse("Not Found",{status:404});
            }
            for(const chapter of course.chapters){
                if(chapter.muxData?.assetId) {
                    await video.assets.delete(chapter.muxData.assetId);
                }
            }
            const deletedCourse = await db.course.delete({
                where:{
                    id:params.courseId,
                }
            })
            return NextResponse.json(deletedCourse);
        }catch (err){
            console.log("COURSEID DELETE",Error);
            return new NextResponse("Internal Error",{status:500});
        }
    }
export async function PATCH(req:Request,
    { params}:{params:{courseId:string}}) {
    try{
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();
        if(!userId || !isTeacher(userId)){
            return new NextResponse("Unauthorized",{status:401});
        }
        const course = await db.course.update({
            where:{
                id:courseId,
                userId
            },
            data:{
                ...values,
            }
        });
        return NextResponse.json(course);
    } catch (err) {
        console.log("[COURSEID]",err);
        return new NextResponse("Internal error",{status:500});
    }
}