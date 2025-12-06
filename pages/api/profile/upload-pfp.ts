import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getTokenFromReq, verifyToken } from "../../../lib/auth";
import { Store } from "../../../lib/store";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const payload: any = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload error" });
    const file: any = files.pfp;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    const relative = `/uploads/${file.newFilename}`;
    // find user by id
    const user = Store.listUsers().find(u => u.id === payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    Store.updateUserStats(user.phone, { pfpUrl: relative });
    // In production: notify bot to update profile on WhatsApp
    res.json({ ok: true, url: relative });
  });
}
