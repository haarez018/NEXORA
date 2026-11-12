// Shared deterministic fixture source. Public preview only; never represents operational records.
export const DEMO_ORG_ID = "demo-nexora";
export const demoSuppliers = [
  { id: "demo-supplier-1", name: "Vertex Supply Co.", category: "Technology", initials: "VS", signal: "Low", detail: "Consistent delivery history in fixture" },
  { id: "demo-supplier-2", name: "Meridian Industrial", category: "Workspace", initials: "MI", signal: "Medium", detail: "Fixture includes a new bank detail signal" },
  { id: "demo-supplier-3", name: "Atlas Components", category: "Electronics", initials: "AC", signal: "Low", detail: "No elevated signals in fixture" },
] as const;
export const demoOffers = [
  { id: "demo-offer-1", supplierId: "demo-supplier-1", title: "USB-C docking stations", category: "Technology", quantity: 120, unitPriceMinor: "12800", deadline: "2027-02-01T12:00:00.000Z" },
  { id: "demo-offer-2", supplierId: "demo-supplier-2", title: "Ergonomic task chairs", category: "Workspace", quantity: 80, unitPriceMinor: "24500", deadline: "2027-02-01T12:00:00.000Z" },
  { id: "demo-offer-3", supplierId: "demo-supplier-3", title: "Environmental sensor kits", category: "Electronics", quantity: 200, unitPriceMinor: "5600", deadline: "2027-02-01T12:00:00.000Z" },
] as const;
export const demoCoalitions = [
  { id: "demo-coalition-1", name: "Connected workspace", category: "Technology", buyers: 3, quantity: 60, totalMinor: "768000", progress: 75, status: "Active", color: "cyan" },
  { id: "demo-coalition-2", name: "Better spaces collective", category: "Workspace", buyers: 2, quantity: 40, totalMinor: "980000", progress: 52, status: "Forming", color: "violet" },
  { id: "demo-coalition-3", name: "Smart operations network", category: "Electronics", buyers: 2, quantity: 100, totalMinor: "560000", progress: 88, status: "Active", color: "emerald" },
] as const;
export const demoAgreements = [
  { id: "demo-agreement-1", title: "Workspace hardware procurement", supplierId: "demo-supplier-1", totalMinor: "768000", status: "ACTIVE", label: "Evidence pending" },
  { id: "demo-agreement-2", title: "Office seating collective", supplierId: "demo-supplier-2", totalMinor: "980000", status: "AWAITING_ACCEPTANCE", label: "Awaiting acceptance" },
  { id: "demo-agreement-3", title: "Sensor pilot deployment", supplierId: "demo-supplier-3", totalMinor: "560000", status: "DRAFT", label: "Draft" },
] as const;
export const demoActivity = [
  { time: "10:42", title: "Coalition fixture loaded", detail: "Connected workspace · 3 synthetic buyers", kind: "core" },
  { time: "10:38", title: "Negotiation example prepared", detail: "Round 2 of 5 · scripted proposal, no model call", kind: "core" },
  { time: "10:31", title: "Evidence checklist drafted", detail: "Workspace hardware · no fulfillment verified", kind: "proof" },
  { time: "10:24", title: "Risk signal fixture added", detail: "Meridian Industrial · synthetic bank detail change", kind: "risk" },
] as const;
export const demoTrend = [
  { day: "Mon", demand: 14200, allocated: 10200 }, { day: "Tue", demand: 15800, allocated: 12100 },
  { day: "Wed", demand: 14900, allocated: 11600 }, { day: "Thu", demand: 18400, allocated: 14300 },
  { day: "Fri", demand: 17200, allocated: 13800 }, { day: "Sat", demand: 21800, allocated: 17600 },
  { day: "Sun", demand: 23080, allocated: 18600 },
];
// Trend values are illustrative whole USD chart observations, not ledger amounts.
