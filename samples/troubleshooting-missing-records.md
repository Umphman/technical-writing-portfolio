# Diagnose missing records when an optional field is null

A support desk reports two unassigned tickets, but its ticket list shows only one. The second record exists. The tenant is correct. Retrying the same lookup changes nothing.

This tutorial reproduces that failure in a fictional support-ticket service. You will trace the cause, select a corrected implementation, and verify recovery without widening tenant access.

**About this sample:** This is an independently reproducible teaching example inspired by general troubleshooting work. All tickets, organizations, code, and results are synthetic. It contains no production records or implementation. The example uses native JavaScript own-property semantics; it does not simulate a database query engine.

## Before you begin

Open a terminal in this portfolio's root directory and check your prerequisite:

```sh
node --version
```

Use Node.js 22.18 or later. No installation of packages, credentials, network access, or running service is required. Every command below reads fixed data without writing files.

[records.mjs](../examples/records/records.mjs) contains the fictional tickets and both filter versions. [check.mjs](../examples/records/check.mjs) checks the selected version against the same expected result. No source edits are needed.

## Establish what the result should contain

For this fictional service, the record contract is:

| Stored `queueId` | Meaning |
| --- | --- |
| Property absent | Unassigned ticket |
| `null` | Unassigned ticket |
| A string containing at least one non-whitespace character | Ticket assigned to that named queue |
| Empty or whitespace-only string | Invalid queue label; excluded from unassigned results |

The query contract is separate: the caller must provide a tenant and an explicit queue selection. `queueId: null` requests unassigned tickets. A string containing at least one non-whitespace character requests that exact named queue. An omitted selection is rejected. Accepted names are matched exactly, without trimming: `" billing "` and `"billing"` are different selections.

The Orchard tenant has these relevant records:

```js
{ id: "T-101", tenantId: "orchard" }
{ id: "T-102", tenantId: "orchard", queueId: null }
{ id: "T-103", tenantId: "orchard", queueId: "billing" }
{ id: "T-104", tenantId: "orchard", queueId: "" }
```

An unassigned lookup should return `T-101` and `T-102`. Establish that expectation before changing the filter.

## Reproduce the failure

Select the defective version:

```sh
node examples/records/check.mjs --mode=before
```

Expected output:

<!-- verified-output: check:records:before -->
```text
Check: Orchard unassigned tickets
Expected: ["T-101","T-102"]
Actual: ["T-101"]
Tenant isolation: PASS
Result: FAIL
```

The command exits with status **1**. That nonzero status is expected here: you have reproduced the missing-record defect. `T-102` exists but is omitted.

Continue only if the output matches. A missing-file error means the working directory or checkout is wrong; a `Usage:` message means the mode argument is incorrect and exits with status 2. Neither reproduces this defect. Correct the command before investigating the filter.

## Trace the record through the filter

Inspect these questions in order:

1. **Does the record exist in the input?** Locate `T-102` in the fixture.
2. **Does it belong to the requested tenant?** Both the record and query use `orchard`. Keep this ownership check intact throughout the investigation.
3. **Does its stored shape match the intended selection?** It has an explicit `queueId: null`, which the contract accepts as unassigned.
4. **Does the predicate implement that contract?** The original unassigned condition checks only property absence:

```js
!Object.hasOwn(ticket, "queueId")
```

`Object.hasOwn` checks whether the object itself contains the property. A property with a `null` value still exists. Therefore, the condition includes `T-101` and excludes `T-102`.

An explicit `undefined` value is also a present property. This example excludes it: the contract accepts absence or `null`, not every value that might mean “empty” elsewhere.

## Correct the condition without widening ownership

Express the two accepted states directly:

```js
export function isUnassigned(ticket) {
  return !Object.hasOwn(ticket, "queueId") || ticket.queueId === null;
}
```

The full filter keeps tenant ownership outside that condition:

```js
ticket.tenantId === filter.tenantId &&
  (filter.queueId === null
    ? isUnassigned(ticket)
    : matchesNamedQueue(ticket, filter.queueId))
```

A ticket must belong to the requested tenant before either queue branch can include it. Riverside tickets must remain invisible to Orchard.

Avoid replacing the condition with `!ticket.queueId`. That would also accept the empty string and explicit `undefined`, expanding the meaning of unassigned beyond the contract.

The correction changes which records the filter selects; it does not migrate or modify stored records.

## Recover and verify

Select the corrected version and rerun the same check:

```sh
node examples/records/check.mjs --mode=after
```

Expected output:

<!-- verified-output: check:records:after -->
```text
Check: Orchard unassigned tickets
Expected: ["T-101","T-102"]
Actual: ["T-101","T-102"]
Tenant isolation: PASS
Result: PASS
```

Expect exit status **0**. The check verifies both the complete result and tenant ownership. This command selects the bundled correction for this local run; it changes no persistent setting.

Run the focused suite:

```sh
node --test examples/records/records.test.mjs
```

Expect 13 passing tests and zero failures. Timings and formatting can vary by Node version.

The suite covers both representations, rejected values, exact queues, tenant boundaries, valid empty results, and frozen inputs. It also executes the failure and recovery commands, checking their output and exit statuses, and rejects invalid CLI modes.

Finally, run the comparison:

```sh
node examples/records/demo.mjs
```

<!-- verified-output: demo:records -->
```text
Case: Orchard support desk, unassigned queue
Before: ["T-101"]
Expected: ["T-101","T-102"]
After: ["T-101","T-102"]
Empty queue label excluded: true
Other tenant excluded: true
Valid empty result (queue "returns"): []
```

Expect exit status 0. The last line is healthy: Orchard has no tickets in the `returns` queue. Result count alone cannot distinguish an empty selection from a broken filter.

These checks establish this JavaScript example's behavior. Here, `tenantId` is trusted test input; a real service must enforce ownership through authentication and authorization. Nothing needs cleanup. Rerunning `--mode=before` reproduces the original failure without undoing or modifying anything.
