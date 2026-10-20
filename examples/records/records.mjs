/**
 * Fictional support tickets for a native JavaScript filtering example.
 * These records and functions are independent of any production service.
 */
export const tickets = [
  { id: "T-101", tenantId: "orchard", subject: "Update contact details" },
  { id: "T-102", tenantId: "orchard", queueId: null, subject: "Change email" },
  { id: "T-103", tenantId: "orchard", queueId: "billing", subject: "Invoice copy" },
  { id: "T-104", tenantId: "orchard", queueId: "", subject: "Invalid queue label" },
  { id: "T-105", tenantId: "orchard", queueId: "support", subject: "Reset password" },
  { id: "T-201", tenantId: "riverside", subject: "Update phone number" },
  { id: "T-202", tenantId: "riverside", queueId: null, subject: "Change address" },
  { id: "T-203", tenantId: "riverside", queueId: "billing", subject: "Invoice question" },
];

function validateFilter(filter) {
  if (!filter || typeof filter.tenantId !== "string" || !filter.tenantId.trim()) {
    throw new TypeError("tenantId must contain a non-whitespace character");
  }
  if (
    !Object.hasOwn(filter, "queueId") ||
    (filter.queueId !== null &&
      (typeof filter.queueId !== "string" || !filter.queueId.trim()))
  ) {
    throw new TypeError("queueId must be null or a string containing a non-whitespace character");
  }
}

function matchesNamedQueue(ticket, queueId) {
  return Object.hasOwn(ticket, "queueId") && ticket.queueId === queueId;
}

/**
 * Deliberately defective version: it misses explicitly null queueId values.
 * queueId: null requests unassigned tickets; a string requests that exact queue.
 */
export function findTicketsBefore(records, filter) {
  validateFilter(filter);
  return records.filter(
    (ticket) =>
      ticket.tenantId === filter.tenantId &&
      (filter.queueId === null
        ? !Object.hasOwn(ticket, "queueId")
        : matchesNamedQueue(ticket, filter.queueId)),
  );
}

/** Native JavaScript own-property semantics, not a database query emulator. */
export function isUnassigned(ticket) {
  return !Object.hasOwn(ticket, "queueId") || ticket.queueId === null;
}

/**
 * The correction changes only the unassigned condition.
 * Tenant ownership remains required for every returned ticket.
 */
export function findTickets(records, filter) {
  validateFilter(filter);
  return records.filter(
    (ticket) =>
      ticket.tenantId === filter.tenantId &&
      (filter.queueId === null
        ? isUnassigned(ticket)
        : matchesNamedQueue(ticket, filter.queueId)),
  );
}
