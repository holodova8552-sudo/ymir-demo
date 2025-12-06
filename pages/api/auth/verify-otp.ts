import type { NextApiRequest, NextApiResponse } from "next";
import { Store } from "../../../lib/store";
import { signToken } from "../../../lib/auth";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "phone and otp required" });

  // demo accepts either stored OTP OR fixed '123456'
  const ok = otp === "YMIRBOTZ" || Store.verifyOtp(phone, otp);
  if (!ok) return res.status(401).json({ message: "Invalid/expired OTP. Try YMIRBOTZ." });

  const user = Store.findUserByPhone(phone);
  if (!user) return res.status(404).json({ message: "User not found (send OTP first)" });

  const token = signToken({ sub: user.id, phone: user.phone });
  res.setHeader("Set-Cookie", cookie.serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }));
  res.json({ ok: true });
}
