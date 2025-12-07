import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

/*
  This endpoint receives events from the bot.
  Expected events:
  - inventory_update: { phone, cards: [...], balance, xp, level }
  - card_claimed: { phone, card }
  - purchase_made: { phone, amount, item }
  Use BOT_WEBHOOK_SECRET to verify.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = req.headers["x-bot-secret"];
  if (!secret || secret !== process.env.BOT_WEBHOOK_SECRET) return res.status(403).json({ message: "Forbidden" });

  const event = req.body;
  const type = event.type;
  const phone = event.phone;
  if (!phone) return res.status(400).json({ message: "phone required" });

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (type === "inventory_update") {
    const { cards, balance, xp, level } = event.payload;
    // For simplicity: delete old cards and recreate. You may prefer upsert logic.
    await prisma.card.deleteMany({ where: { ownerId: user.id } });
    if (Array.isArray(cards)) {
      for (const c of cards) {
        await prisma.card.create({
          data: {
            ownerId: user.id,
            name: c.name,
            rarity: c.rarity || "common",
            metadata: c.metadata || {},
          },
        });
      }
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: balance ?? user.balance, xp: xp ?? user.xp, level: level ?? user.level },
    });
    return res.json({ ok: true });
  }

  if (type === "card_claimed") {
    const { card } = event.payload;
    await prisma.card.create({
      data: { ownerId: user.id, name: card.name, rarity: card.rarity || "common", metadata: card.metadata || {} },
    });
    return res.json({ ok: true });
  }

  res.status(400).json({ message: "Unknown event type" });
}
