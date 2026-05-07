import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStream } from "@/lib/ai/provider";
import { getPrompt } from "@/lib/ai/prompts";
import { generateSchema } from "@/lib/validations";
import { PLANS, type PlanKey } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
    });
  }

  const { copyType, topic, keywords, tone, additionalContext, model } =
    parsed.data;
  const userId = session.user.id;

  // Check usage
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const usage = await prisma.usageRecord.findUnique({
    where: { userId_month: { userId, month } },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const planKey = (subscription?.plan || "FREE") as PlanKey;
  const plan = PLANS[planKey];

  if (plan.monthlyGenerations !== -1 && (usage?.count || 0) >= plan.monthlyGenerations) {
    return new Response(
      JSON.stringify({
        error: "已达到本月使用上限，请升级套餐",
        code: "QUOTA_EXCEEDED",
      }),
      { status: 429 }
    );
  }

  // Build prompts
  const promptTemplate = getPrompt(copyType);
  const systemPrompt = promptTemplate.system;
  const userPrompt = promptTemplate.buildUserPrompt({
    topic,
    keywords,
    tone,
    additionalContext,
  });

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullOutput = "";

      try {
        for await (const chunk of generateStream({
          systemPrompt,
          userPrompt,
          model,
          maxTokens: plan.maxTokensPerGeneration,
        })) {
          if (chunk.done) break;
          fullOutput += chunk.content;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`)
          );
        }

        // Save to database
        await prisma.generatedContent.create({
          data: {
            userId,
            copyType,
            modelUsed: model,
            prompt: userPrompt,
            systemPrompt,
            output: fullOutput,
            tokensUsed: Math.ceil(fullOutput.length / 4), // rough estimate
            tone,
          },
        });

        // Update usage
        await prisma.usageRecord.upsert({
          where: { userId_month: { userId, month } },
          create: { userId, month, count: 1 },
          update: { count: { increment: 1 } },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: (error as Error).message })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
