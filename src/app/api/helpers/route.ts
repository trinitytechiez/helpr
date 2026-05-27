import { NextRequest, NextResponse } from "next/server";

// Prevent pre-rendering during build
export const dynamic = "force-dynamic";

// GET all helpers
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const helpers = await prisma.helper.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(helpers);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch helpers" },
      { status: 500 }
    );
  }
}

// POST create helper
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

    const helper = await prisma.helper.create({
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

    return NextResponse.json(helper, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create helper" },
      { status: 500 }
    );
  }
}
