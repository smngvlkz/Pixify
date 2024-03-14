import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPost(id: number) {
  return await prisma.post.findUnique({
    where: { id },
  });
}
