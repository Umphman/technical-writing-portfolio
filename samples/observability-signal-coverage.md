# Document what telemetry actually exposes

**Reader:** an operator configuring monitoring for a service.

**Scope:** an evidence-selection excerpt adapted from an observability guide I authored and maintained with AI assistance. The table below condenses the guide's distinctions into operator questions. Private feature names, metric identifiers, endpoints, and asset paths are omitted; this is a behavioral reference, not a deployment procedure.

## Choose evidence for the question

Use the kind of evidence that can answer the question. A diagnostic report, a runtime metric, and a dashboard definition establish different things.

| Operator question | Evidence identified by the guide | Next action | What this evidence cannot establish |
| --- | --- | --- | --- |
| Are service requests or runs failing? | Counters for HTTP responses by method, path, and status; queue enqueue failures; run completions and failures | Use the documented counter inventory to select the relevant metric | Service counters alone do not establish that an entire user interaction succeeded |
| Can I graph this diagnostic in Prometheus? | Structured events and on-demand count-and-ratio reports that have no dedicated metric family | Inspect the logs or generate the report for that diagnostic | Report output is not automatically an emitted time series |
| How do I inspect a deployment check? | Operator verification scripts | Inspect the script's check results | An operator check is not runtime instrumentation or a product-facing diagnostic |
| What monitoring assets are available? | Separate scrape configuration, alert-rule files, and dashboard JSON | Review the asset inventory for the configuration, rules, and dashboard needed | The presence of these files does not establish a running deployment |
| Did the complete user interaction work? | Staging smoke checks and structured-log review | Exercise the interaction in staging and inspect its associated logs | A dashboard covering service counters cannot replace this check |

The original guide states the metric boundary explicitly:

> They should not be described as already-instrumented Prometheus series unless they are actually added to the registry.

For example, a report may return useful counts and ratios without exposing a series that a dashboard can query over time. Use the report to answer the immediate diagnostic question; describe metric instrumentation as additional work if it has not been implemented.

## Maintenance and validation

When operator verification tooling was added, the implementation change also updated this guide and the canonical documentation index. The new text explicitly identified the checks as operator scripts rather than runtime metrics. Repository history supports that maintenance example.

Portfolio preparation checked the source artifacts and the maintenance change. The table describes the reviewed source baseline; it does not report a private deployment test or a measured monitoring outcome.
