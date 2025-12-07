import type { NextApiRequest, NextApiResponse } from "next";

const items = [
  { id: "p1", name: "ODM Gas Canister", price: 100, image: "/images/shop/gas.png" },
  { id: "p2", name: "Scout Cloak", price: 250, image: "/images/shop/cloak.png" },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ items });
}
