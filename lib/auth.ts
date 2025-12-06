import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getTokenFromReq(req: NextApiRequest) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const m = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
  if (!m) return null;
  return decodeURIComponent(m.split("=")[1]);
}
