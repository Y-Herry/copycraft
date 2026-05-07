import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const copyType = searchParams.get("copyType") || undefined;
  const favorite = searchParams.get("favorite") === "true";

  const where: Record<string, unknown> = { userId: session.user.id };
  if (copyType) where.copyType = copyType;
  if (favorite) where.isFavorite = true;

  const [items, total] = await Promise.all([
    prisma.generatedContent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        copyType: true,
        modelUsed: true,
        prompt: true,
        output: true,
        tone: true,
        isFavorite: true,
        createdAt: true,
      },
    }),
    prisma.generatedContent.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
