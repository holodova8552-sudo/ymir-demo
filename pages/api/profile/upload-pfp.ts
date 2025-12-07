import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const payload: any = jwt.verify(token, process.env.JWT_SECRET || "devsecret");

  const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload error" });
    const file: any = files.pfp;
    if (!file) return res.status(400).json({ message: "No file" });
    const relative = `/uploads/${file.newFilename}`;
    // Update user
    await prisma.user.update({ where: { id: payload.sub }, data: { pfpUrl: relative } });

    res.json({ ok: true, url: relative });
  });
}
