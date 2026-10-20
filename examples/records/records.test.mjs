import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { findTickets, findTicketsBefore, isUnassigned, tickets } from "./records.mjs";

const ids = (records) => records.map((ticket) => ticket.id);

test("reproduces the defect: an explicitly null queue is omitted", () => {
  assert.deepEqual(
    ids(findTicketsBefore(tickets, { tenantId: "orchard", queueId: null })),
    ["T-101"],
  );
  assert.equal(
    tickets.some((ticket) => ticket.id === "T-102" && ticket.queueId === null),
    true,
  );
});

test("returns both absent and explicitly null queues as unassigned", () => {
  assert.deepEqual(
    ids(findTickets(tickets, { tenantId: "orchard", queueId: null })),
    ["T-101", "T-102"],
  );
});

test("does not treat an empty string as an unassigned queue", () => {
  assert.equal(isUnassigned({ queueId: "" }), false);
  assert.equal(isUnassigned({ queueId: "billing" }), false);
});

test("an explicit undefined property is present and is not null", () => {
  assert.equal(isUnassigned({}), true);
  assert.equal(isUnassigned({ queueId: undefined }), false);
  assert.equal(isUnassigned({ queueId: null }), true);
});

test("selects exactly the requested named queue", () => {
  assert.deepEqual(
    ids(findTickets(tickets, { tenantId: "orchard", queueId: "billing" })),
    ["T-103"],
  );
});

test("does not return another tenant's unassigned tickets", () => {
  assert.deepEqual(
    ids(findTickets(tickets, { tenantId: "riverside", queueId: null })),
    ["T-201", "T-202"],
  );
  assert.deepEqual(
    findTickets(tickets, { tenantId: "unknown-tenant", queueId: null }),
    [],
  );
});

test("does not return another tenant's ticket in a matching named queue", () => {
  assert.deepEqual(
    ids(findTickets(tickets, { tenantId: "riverside", queueId: "billing" })),
    ["T-203"],
  );
});

test("an existing tenant with no matching queue legitimately returns no tickets", () => {
  assert.deepEqual(
    findTickets(tickets, { tenantId: "orchard", queueId: "returns" }),
    [],
  );
});

test("filtering does not modify frozen input records or the filter", () => {
  const records = Object.freeze(
    tickets.map((ticket) => Object.freeze({ ...ticket })),
  );
  const filter = Object.freeze({ tenantId: "orchard", queueId: null });
  const snapshot = structuredClone(records);
  const before = findTicketsBefore(records, filter);
  const after = findTickets(records, filter);
  assert.deepEqual(records, snapshot);
  assert.deepEqual(filter, { tenantId: "orchard", queueId: null });
  assert.notEqual(before, records);
  assert.notEqual(after, records);
});

test("requires a tenant and an explicit, valid queue selection", () => {
  for (const find of [findTicketsBefore, findTickets]) {
    for (const filter of [
      undefined,
      { queueId: null },
      { tenantId: "", queueId: null },
      { tenantId: "orchard" },
      { tenantId: "orchard", queueId: undefined },
      { tenantId: "orchard", queueId: "" },
      { tenantId: "orchard", queueId: " " },
    ]) {
      assert.throws(() => find(tickets, filter), TypeError);
    }
  }
});

const checkPath = fileURLToPath(new URL("./check.mjs", import.meta.url));

function runCheck(args) {
  const result = spawnSync(process.execPath, [checkPath, ...args], {
    encoding: "utf8",
  });
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  return result;
}

test("CLI returns exit 1 for the reproduced omission with the expected diagnostic", () => {
  const result = runCheck(["--mode=before"]);
  assert.equal(result.status, 1);
  assert.equal(result.stderr, "");
  assert.equal(
    result.stdout,
    [
      "Check: Orchard unassigned tickets",
      'Expected: ["T-101","T-102"]',
      'Actual: ["T-101"]',
      "Tenant isolation: PASS",
      "Result: FAIL",
      "",
    ].join("\n"),
  );
});

test("CLI returns exit 0 after recovery and verifies the complete owned result", () => {
  const result = runCheck(["--mode=after"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(
    result.stdout,
    [
      "Check: Orchard unassigned tickets",
      'Expected: ["T-101","T-102"]',
      'Actual: ["T-101","T-102"]',
      "Tenant isolation: PASS",
      "Result: PASS",
      "",
    ].join("\n"),
  );
});

test("CLI rejects missing, unknown, and ambiguous modes with exit 2", () => {
  for (const args of [
    [],
    ["--mode=unknown"],
    ["--mode=before", "--mode=after"],
    ["--mode=after", "extra"],
  ]) {
    const result = runCheck(args);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /^Usage: node examples\/records\/check\.mjs /);
  }
});
