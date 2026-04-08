// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient;
// };

// const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

import { PrismaClient } from "@/generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

export default prisma;
