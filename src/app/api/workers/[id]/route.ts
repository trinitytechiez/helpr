import { NextRequest, NextResponse } from "next/server";

// Prevent pre-rendering during build
export const dynamic = "force-dynamic";

// GET single worker
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { id } = await params;
    const worker = await prisma.worker.findUnique({
      where: { id },
    });

    if (!worker) {
      return NextResponse.json(
        { message: "Worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(worker);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch worker" },
      { status: 500 }
    );
  }
}

// PUT update worker
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      phone,
      department,
      category,
      joinDate,
      isActive,
      salaryType,
      salaryAmount,
      designatedLeaves,
      leaveCarryover,
      photoUrl,
    } = body;

    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(department !== undefined && { department }),
        ...(category !== undefined && { category }),
        ...(joinDate && { joinDate: new Date(joinDate) }),
        ...(isActive !== undefined && { isActive }),
        ...(salaryType && { salaryType }),
        ...(salaryAmount !== undefined && {
          salaryAmount: parseFloat(salaryAmount),
        }),
        ...(designatedLeaves !== undefined && {
          designatedLeaves: parseInt(designatedLeaves),
        }),
        ...(leaveCarryover !== undefined && { leaveCarryover }),
        ...(photoUrl !== undefined && { photoUrl }),
      },
    });

    return NextResponse.json(worker);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update worker" },
      { status: 500 }
    );
  }
}

// DELETE worker (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { id } = await params;
    const worker = await prisma.worker.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(worker);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete worker" },
      { status: 500 }
    );
  }
}
