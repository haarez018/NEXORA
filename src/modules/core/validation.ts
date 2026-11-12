import { z } from "zod";
export const minorUnits = z.string().max(19).regex(/^(0|[1-9]\d*)$/).refine(v => /^(0|[1-9]\d*)$/.test(v) && v.length <= 19 && BigInt(v) <= 9223372036854775807n, "Amount exceeds PostgreSQL bigint");
export const currency = z.literal("USD"); // Initial scope deliberately supports one currency.
export const buyerDemandSchema = z.object({
  title: z.string().trim().min(3).max(160), quantity: z.number().int().positive().max(1000000),
  maxTotalMinor: minorUnits.refine(v => /^[1-9]\d*$/.test(v), "Budget must be positive"),
  currency, destination: z.string().trim().min(2).max(200), deadline: z.iso.datetime(),
  specification: z.record(z.string(), z.string().max(1000)),
}).strict();
export const supplierOfferSchema = z.object({
  title: z.string().trim().min(3).max(160), capacity: z.number().int().positive().max(1000000),
  unitPriceMinor: minorUnits.refine(v => /^[1-9]\d*$/.test(v), "Price must be positive"), currency, expiresAt: z.iso.datetime(),
}).strict();
