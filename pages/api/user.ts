"use strict";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getPost } from "@/lib/db";

const prisma = new PrismaClient();

type ErrorResponse = {
  error: string;
};

export type Data = {
  id: number;
  imageUrl: string;
  description: string;
  ageRange: string;
  createdAt: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      const post = await getPost(Number(id));
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(post);
    } else if (req.method === "POST") {
      const { imageUrl, description, ageRange } = req.body;

      // Validate the request body
      if (!imageUrl || !description || !ageRange) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

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

      // Validate the request body
      if (!id || !imageUrl || !description || !ageRange) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
          imageUrl,
          description,
          ageRange,
        },
      });
      res.json(post);
    } else if (req.method === "DELETE") {
      const { id } = req.body;

      // Validate the request body
      if (!id) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const post = await prisma.post.delete({
        where: { id: Number(id) },
      });
      res.json(post);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}
