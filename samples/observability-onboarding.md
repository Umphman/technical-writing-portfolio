# Explain and troubleshoot OpenTelemetry onboarding

**Readers:** developers choosing an instrumentation path and operators investigating missing telemetry.

**My contribution:** I authored the original documentation for this public OpenTelemetry case study, using Codex to refine the text and help keep it aligned with implementation changes. The passages below are selected from that existing documentation; the connecting commentary was prepared for this portfolio with Codex assistance.

The project uses a synthetic Node.js checkout service, Grafana Alloy, and a local observability stack. Its documentation compares instrumentation paths, explains failures, and records the evidence needed to distinguish a running application from usable telemetry.

## Explain what automatic instrumentation actually means

The original [Instrumentation and Export Paths](https://github.com/Umphman/otel-onboarding-experience-case-study/blob/cc80d436d65e09854102ddb005d11a76bd2a9a60/docs/instrumentation-paths.md#the-two-implemented-nodejs-modes) compares two configured modes against the same workload. Selected rows from its comparison:

| Dimension | Explicit Node.js SDK | Node.js automatic instrumentation |
| --- | --- | --- |
| Library coverage | HTTP instrumentation is selected explicitly | The upstream bundle discovers and enables its supported Node.js library instrumentations |
| Control surface | Code plus standard environment variables | Primarily standard environment variables and the preload command |
| Best fit | Domain context, explicit lifecycle control, nonstandard libraries, or a deliberately narrow instrumentation set | A fast baseline for a supported Node.js runtime and libraries |
| Main cost | More application-owned telemetry code and upgrades | Broader implicit behavior, coverage gaps, and less obvious ownership when defaults change |

The original explanation then qualifies the word “automatic”:

> The application contains OpenTelemetry API calls for its domain span, metrics, and log records in both modes. Therefore, “automatic” here describes SDK bootstrap and supported-library instrumentation; it does **not** claim that application-specific business semantics appeared with no code. Calling this mode simply “zero-code” would hide that distinction.

That explanation helps the reader choose a mode without assuming that automatic library instrumentation supplies application-specific meaning. The same workload and validation request make the comparison interpretable.

## When a healthy application has no telemetry

The existing [bad OTLP endpoint scenario](https://github.com/Umphman/otel-onboarding-experience-case-study/blob/cc80d436d65e09854102ddb005d11a76bd2a9a60/scenarios/bad-otlp-endpoint/README.md) deliberately configures an unreachable application-to-Alloy port. The procedure generates a checkout request, checks application health, and inspects exporter logs before attempting recovery.

The original diagnosis reads:

> The wrong port is configured at the application-to-Alloy hop. Restore `http://alloy:4318` by removing the two-file scenario stack, starting a fresh default stack without `loadgen`, and running a new bounded verifier probe.

These are the observations recorded for the local experiment on 21 September 2026:

| Evidence | Interpretation |
| --- | --- |
| Application health returned `200` | The workload was responding; this did not establish telemetry receipt |
| Export to `alloy:14318` reported `ECONNREFUSED` | The configured application-to-Alloy destination was unreachable |
| Alloy receipt was not established; Tempo returned no matching trace and Loki returned no records | The failure was upstream of useful backend evidence |
| Removing the override and restarting produced a fresh probe that passed the full pipeline verifier | Recovery was established with new telemetry, rather than an earlier successful result |

The [dated failure and recovery record](https://github.com/Umphman/otel-onboarding-experience-case-study/blob/cc80d436d65e09854102ddb005d11a76bd2a9a60/docs/evidence/runtime-verification.md#observed-local-failures-and-recovery) contains the original probe identifiers and results. Exporter failure-counter series were unavailable in that run; the record does not turn their absence into a zero-failure claim.

This is the diagnostic sequence the writing makes explicit: separate application health from pipeline health, identify the failing hop, change the relevant configuration, and require a fresh recovery probe.

## Run a failure and prove recovery

The [complete runnable tutorial](../otel/README.md) starts from the pinned public source, applies the local corrections included in this portfolio, and deliberately breaks context propagation. It generates an identified request, checks its two separate traces in Tempo, then verifies recovery with a fresh request across Alloy, Tempo, Loki, and Prometheus.

Review found that the published broken-context procedure asked readers to inspect a checkout without first generating one. The correction adds that missing action and verifies backend receipt. It also clears inherited telemetry settings and Node preloads before launching the tools; telling readers to use a “clean terminal” was insufficient.

The corrected procedure passed locally on 20 October 2026. Its patch is included here; the public repository has not been changed. The [verification record](../VERIFICATION.md) separates this new execution from the historical bad-endpoint evidence above. The tutorial and correction code were prepared with Codex during portfolio review.
