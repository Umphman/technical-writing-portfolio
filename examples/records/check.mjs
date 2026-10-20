import { findTickets, findTicketsBefore, tickets } from "./records.mjs";

const args = process.argv.slice(2);
const mode = args.length === 1 ? args[0] : "";

if (mode !== "--mode=before" && mode !== "--mode=after") {
  console.error(
    "Usage: node examples/records/check.mjs --mode=before (or --mode=after)",
  );
  process.exitCode = 2;
} else {
  const find = mode === "--mode=before" ? findTicketsBefore : findTickets;
  const result = find(tickets, { tenantId: "orchard", queueId: null });
  const expectedIds = ["T-101", "T-102"];
  const actualIds = result.map((ticket) => ticket.id).sort();
  const isolated = result.every((ticket) => ticket.tenantId === "orchard");
  const complete = JSON.stringify(actualIds) === JSON.stringify(expectedIds);
  const passed = isolated && complete;

  console.log("Check: Orchard unassigned tickets");
  console.log(`Expected: ${JSON.stringify(expectedIds)}`);
  console.log(`Actual: ${JSON.stringify(actualIds)}`);
  console.log(`Tenant isolation: ${isolated ? "PASS" : "FAIL"}`);
  console.log(`Result: ${passed ? "PASS" : "FAIL"}`);
  process.exitCode = passed ? 0 : 1;
}
