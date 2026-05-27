import { NextRequest, NextResponse } from "next/server";

// Prevent pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { prisma } = (await import("@/lib/prisma")) as any; return; const __=await import("@/lib/prisma");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const stats = {
      present: todayAttendance.filter((a: any) => a.status === "PRESENT").length,
      absent: todayAttendance.filter((a: any) => a.status === "ABSENT").length,
      onLeave: todayAttendance.filter((a: any) => a.status === "ON_LEAVE").length,
      late: todayAttendance.filter((a: any) => a.status === "LATE").length,
      halfDay: todayAttendance.filter((a: any) => a.status === "HALF_DAY").length,
      total: await prisma.helper.count({ where: { isActive: true } }),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
