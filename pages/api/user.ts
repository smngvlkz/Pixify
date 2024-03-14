import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  id: number;
  imageUrl: string;
  description: string;
  ageRange: string;
  createdAt: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Data[]>
) {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } else if (req.method === "POST") {
    const { imageUrl, description, ageRange } = req.body;
    const post = await prisma.post.create({
      data: {
        imageUrl,
        description,
        ageRange,
      },
    });
    res.json(post);
  } else if (req.method === "PUT") {
    const { id, imageUrl, description, ageRange } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        imageUrl,
        description,
        ageRange,
      },
    });
    res.json(post);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const post = await prisma.post.delete({
      where: { id },
    });
    res.json(post);
  } else {
    res.status(405).end();
  }
}
