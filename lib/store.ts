// In-memory demo store for users, cards, OTPs.
// NOTE: This is ephemeral and for demo only.
type User = {
  id: string;
  phone: string;
  username: string;
  pfpUrl?: string;
  balance: number;
  xp: number;
  level: number;
  cards: Card[];
};

type Card = {
  id: string;
  name: string;
  rarity: string;
  metadata?: any;
};

import crypto from "crypto";

const users: Record<string, User> = {}; // keyed by phone
const otps: Record<string, { code: string; expires: number }> = {};

function genId(prefix = "") {
  return prefix + crypto.randomBytes(6).toString("hex");
}

export const Store = {
  findUserByPhone(phone: string) {
    return users[phone] ?? null;
  },
  createUser(phone: string, username: string) {
    const user: User = {
      id: genId("u_"),
      phone,
      username,
      pfpUrl: undefined,
      balance: 0,
      xp: 0,
      level: 1,
      cards: [],
    };
    users[phone] = user;
    return user;
  },
  upsertUser(phone: string, username: string) {
    const existing = users[phone];
    if (existing) {
      existing.username = username ?? existing.username;
      return existing;
    }
    return this.createUser(phone, username);
  },
  saveOtp(phone: string, code: string, ttlSeconds = 300) {
    otps[phone] = { code, expires: Date.now() + ttlSeconds * 1000 };
  },
  verifyOtp(phone: string, code: string) {
    const rec = otps[phone];
    if (!rec) return false;
    if (rec.expires < Date.now()) return false;
    return rec.code === code;
  },
  addCardToUser(phone: string, card: Omit<Card, "id">) {
    const u = users[phone];
    if (!u) return null;
    const c: Card = { id: genId("c_"), ...card };
    u.cards.push(c);
    return c;
  },
  replaceCards(phone: string, cards: Omit<Card, "id">[]) {
    const u = users[phone];
    if (!u) return null;
    u.cards = cards.map(c => ({ id: genId("c_"), ...c }));
    return u.cards;
  },
  updateUserStats(phone: string, data: Partial<Pick<User, "balance" | "xp" | "level" | "pfpUrl">>) {
    const u = users[phone];
    if (!u) return null;
    Object.assign(u, data);
    return u;
  },
  listUsers() {
    return Object.values(users);
  },
};
