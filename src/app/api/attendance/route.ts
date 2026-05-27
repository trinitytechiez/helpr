import { NextRequest, NextResponse } from "next/server";

// Prevent pre-rendering during build
export const dynamic = "force-dynamic";

// GET attendance for a specific date
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDate,
        },
      },
      include: { helper: true },
    });

    return NextResponse.json(attendance);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

// POST mark attendance
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { helperId, date, status, note } = body;

    if (!helperId || !date || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        helperId_date: {
          helperId,
          date: targetDate,
        },
      },
      update: {
        status,
        note: note || null,
      },
      create: {
        helperId,
        date: targetDate,
        status,
        note: note || null,
      },
    });

    return NextResponse.json(attendance);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to mark attendance" },
      { status: 500 }
    );
  }
}

// POST bulk mark attendance
export async function PUT(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { records } = body;

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { message: "Records must be an array" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      records.map((record: any) => {
        const targetDate = new Date(record.date);
        targetDate.setHours(0, 0, 0, 0);

        return prisma.attendance.upsert({
          where: {
            helperId_date: {
              helperId: record.helperId,
              date: targetDate,
            },
          },
          update: {
            status: record.status,
            note: record.note || null,
          },
          create: {
            helperId: record.helperId,
            date: targetDate,
            status: record.status,
            note: record.note || null,
          },
        });
      })
    );

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update attendance" },
      { status: 500 }
    );
  }
}
