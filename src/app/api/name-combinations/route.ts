import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateNameCombinations } from "@/lib/anthropic";

// =============================================================
// POST /api/name-combinations
// Generate new name combinations and save to database
// =============================================================
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate request body
  let body: { name1?: string; name2?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { name1, name2 } = body;

  if (!name1 || typeof name1 !== "string" || name1.trim().length === 0) {
    return NextResponse.json(
      { error: "name1 is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  if (!name2 || typeof name2 !== "string" || name2.trim().length === 0) {
    return NextResponse.json(
      { error: "name2 is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const trimmedName1 = name1.trim();
  const trimmedName2 = name2.trim();

  try {
    // Generate name combinations using Claude
    const combinations = await generateNameCombinations(
      trimmedName1,
      trimmedName2
    );

    // Save to database using a transaction
    const combinationSet = await prisma.nameCombinationSet.create({
      data: {
        name1: trimmedName1,
        name2: trimmedName2,
        userId: session.user.id,
        results: {
          create: combinations.map((c) => ({
            name: c.name,
            goodness: c.goodness,
          })),
        },
      },
      include: {
        results: true,
      },
    });

    // Return response matching the spec format
    return NextResponse.json({
      id: combinationSet.id,
      name1: combinationSet.name1,
      name2: combinationSet.name2,
      createdAt: combinationSet.createdAt,
      results: combinationSet.results.map((r) => ({
        id: r.id,
        name: r.name,
        goodness: r.goodness,
      })),
    });
  } catch (error) {
    console.error("Error generating name combinations:", error);
    return NextResponse.json(
      { error: "Failed to generate name combinations. Please try again." },
      { status: 500 }
    );
  }
}

// =============================================================
// GET /api/name-combinations
// Retrieve all previously generated name combinations
// =============================================================
export async function GET() {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const combinationSets = await prisma.nameCombinationSet.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        results: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response to match the spec
    const response = combinationSets.map((set) => ({
      id: set.id,
      name1: set.name1,
      name2: set.name2,
      createdAt: set.createdAt,
      results: set.results.map((r) => ({
        id: r.id,
        name: r.name,
        goodness: r.goodness,
      })),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching name combinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch name combinations" },
      { status: 500 }
    );
  }
}
