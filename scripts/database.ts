import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
config({ path: ".env.local", quiet: true }); config({ quiet: true });
export function scriptDatabase() {
 const connectionString=process.env.DATABASE_URL;
 if(!connectionString || !/^postgres(ql)?:\/\//.test(connectionString))throw new Error("Set DATABASE_URL to a PostgreSQL database.");
 return new PrismaClient({adapter:new PrismaPg({connectionString,connectionTimeoutMillis:3000,max:2})});
}
