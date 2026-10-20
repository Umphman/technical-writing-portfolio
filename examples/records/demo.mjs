import { findTickets, findTicketsBefore, tickets } from "./records.mjs";

const ids = (records) => records.map((ticket) => ticket.id);
const filter = { tenantId: "orchard", queueId: null };
const after = findTickets(tickets, filter);

console.log("Case: Orchard support desk, unassigned queue");
console.log(`Before: ${JSON.stringify(ids(findTicketsBefore(tickets, filter)))}`);
console.log('Expected: ["T-101","T-102"]');
console.log(`After: ${JSON.stringify(ids(after))}`);
console.log(`Empty queue label excluded: ${!after.some((ticket) => ticket.id === "T-104")}`);
console.log(`Other tenant excluded: ${after.every((ticket) => ticket.tenantId === "orchard")}`);
console.log(
  `Valid empty result (queue "returns"): ${JSON.stringify(
    ids(findTickets(tickets, { tenantId: "orchard", queueId: "returns" })),
  )}`,
);
