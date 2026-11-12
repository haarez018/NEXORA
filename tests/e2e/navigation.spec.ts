import { test,expect } from "@playwright/test";
import { navigation } from "../../src/lib/navigation";
for(const item of navigation)test("navigation: "+item.label,async({page})=>{
 await page.goto(item.href);
 await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:item.label,exact:true})).toHaveAttribute("aria-current","page");
 await expect(page.locator("h1")).toBeVisible();
 await expect(page.getByText("DEMO ENVIRONMENT",{exact:true})).toBeVisible();
});
test("search filters only demonstration records",async({page})=>{
 await page.goto("/marketplace");await page.getByRole("textbox",{name:"Search demonstration records"}).fill("docking");
 await expect(page.locator("tbody tr")).toHaveCount(1);
 await expect(page.locator("tbody")).toContainText("USB-C docking stations");
 await page.getByRole("textbox",{name:"Search demonstration records"}).fill("not-a-product");await expect(page.getByText("No demonstration records match", {exact:false})).toBeVisible();
});
test("mobile navigation opens and closes",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto("/");
 await page.getByRole("button",{name:"Open navigation",exact:true}).click();
 await page.getByRole("navigation").getByRole("link",{name:"Payments",exact:true}).click();
 await expect(page).toHaveURL("/payments");await expect(page.locator("h1")).toContainText("Authorized by people");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test("chart range control is interactive",async({page})=>{
 await page.goto("/");await page.getByRole("button",{name:"4D",exact:true}).click();await expect(page.getByRole("button",{name:"4D",exact:true})).toHaveAttribute("aria-pressed","true");
});
test("unconfigured demo auth cannot grant workspace access",async({page,request})=>{
 await page.goto("/workspace");await expect(page).toHaveURL("/login");await expect(page.getByRole("button",{name:"Sign in securely"})).toBeDisabled();
 const response=await request.get("/api/v1/organizations/arbitrary");expect(response.status()).toBe(503);
 const auth=await request.post("/api/auth/sign-in/email",{data:{email:"not-real@example.invalid",password:"not-a-real-account",role:"ORG_ADMIN"}});expect(auth.status()).toBe(503);
});
test("health distinguishes liveness from database readiness",async({request})=>{
 const live=await request.get("/api/health");expect(live.status()).toBe(200);expect(await live.json()).toMatchObject({scope:"application-liveness",payments:"disabled",ai:"disabled"});
 const ready=await request.get("/api/health/ready");expect(ready.status()).toBe(503);
});
test("unknown pages return a real 404",async({page})=>{const result=await page.goto("/unknown-route");expect(result?.status()).toBe(404);await expect(page.getByText("This path is uncharted.")).toBeVisible();});
test("dashboard has no horizontal overflow at 390px",async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto("/");expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);});
