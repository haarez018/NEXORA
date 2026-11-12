import { describe,it,expect } from "vitest";
import { buyerDemandSchema, supplierOfferSchema, minorUnits } from "@/modules/core/validation";
import { formatUsd } from "@/lib/money";
const valid={title:"Docking stations",quantity:60,maxTotalMinor:"768000",currency:"USD",destination:"Demo warehouse",deadline:"2027-02-01T12:00:00Z",specification:{ports:"USB-C"}};
describe("foundational model validation",()=>{
 it("accepts an integer-minor-unit demand",()=>expect(buyerDemandSchema.safeParse(valid).success).toBe(true));
 it.each([0,-1,1.5])("rejects invalid quantity %s",quantity=>expect(buyerDemandSchema.safeParse({...valid,quantity}).success).toBe(false));
 it.each(["12.50","-100","01","9223372036854775808"])("rejects invalid monetary value %s",maxTotalMinor=>expect(buyerDemandSchema.safeParse({...valid,maxTotalMinor}).success).toBe(false));
 it("rejects role injection and unsupported currency",()=>{expect(buyerDemandSchema.safeParse({...valid,role:"ORG_ADMIN"}).success).toBe(false);expect(buyerDemandSchema.safeParse({...valid,currency:"EUR"}).success).toBe(false);});
 it("bounds offers and allows exact bigint serialization",()=>{expect(supplierOfferSchema.safeParse({title:"Offer",capacity:1,unitPriceMinor:"12500",currency:"USD",expiresAt:valid.deadline}).success).toBe(true);expect(minorUnits.parse("9223372036854775807")).toBe("9223372036854775807");});
 it("formats money without losing precision",()=>{expect(formatUsd("9007199254740993")).toBe("$90,071,992,547,409.93");expect(formatUsd("-1")).toBe("-$0.01");});
});
