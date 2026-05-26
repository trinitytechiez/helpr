import { NextRequest, NextResponse } from "next/server";

// Prevent pre-rendering during build
export const dynamic = "force-dynamic";

// GET all workers
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const workers = await prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workers);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

// POST create worker
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const {
      name,
      phone,
      department,
      category,
      joinDate,
      salaryType,
      salaryAmount,
      designatedLeaves,
    } = body;

    if (!name || !joinDate || !salaryType || !salaryAmount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        phone: phone || null,
        department: department || null,
        category: category || null,
        joinDate: new Date(joinDate),
        salaryType,
        salaryAmount: parseFloat(salaryAmount),
        designatedLeaves: parseInt(designatedLeaves) || 12,
        leaveCarryover: false,
      },
    });

    return NextResponse.json(worker, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create worker" },
      { status: 500 }
    );
  }
}
