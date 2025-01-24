import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new lead
export async function POST(request) {
  try {
    const data = await request.json();
    const newLead = await prisma.lead.create({ data });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ message: "Error saving lead" }, { status: 500 });
  }
}

// Get all leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
  }
}

// Delete all leads
export async function DELETE() {
  try {
    await prisma.lead.deleteMany();

    return NextResponse.json({ message: "All leads deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting leads:", error);
    return NextResponse.json({ message: "Error deleting leads" }, { status: 500 });
  }
}
