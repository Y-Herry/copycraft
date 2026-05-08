import { prisma } from "@/lib/prisma";
import type { Plan, BillingCycle } from "@prisma/client";

export async function activateSubscription(
  userId: string,
  plan: Plan,
  billingCycle: BillingCycle
) {
  const now = new Date();
  const expiresAt = new Date(now);

  if (billingCycle === "MONTHLY") {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status: "ACTIVE",
      expiresAt,
    },
    update: {
      plan,
      status: "ACTIVE",
      expiresAt,
    },
  });
}
