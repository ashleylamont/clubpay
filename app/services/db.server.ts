import { PrismaClient } from "@prisma/client";

let prisma: ReturnType<typeof newPrismaClient>;

declare global {
  var __db__: ReturnType<typeof newPrismaClient> | undefined;
}

function newPrismaClient() {
  return new PrismaClient();
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// In production, we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = newPrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = newPrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
