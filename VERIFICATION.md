# Portfolio verification

Recorded on **20 October 2026**, using the Europe/Paris calendar date.

## Bundled examples

Environment: Windows, Node.js **22.18.0**, npm **10.9.3**.

| Check | Result | What it establishes |
| --- | --- | --- |
| Authentication tests | 11 passed, zero failed | Issuer and audience checks, credential/session separation, expiry, user isolation, defensive copying, and logout in the in-process fixture |
| Record-filter tests | 13 passed, zero failed | The original omission, null/absent distinctions, named queues, required input, tenant filtering, valid empty results, non-mutating execution, and CLI failure/recovery/usage handling |
| Authentication demonstration | Passed | The executable produced the tutorial's eight-line output |
| Record-filter demonstration | Passed | The executable produced the tutorial's before/after comparison |
| Failure and recovery commands | Passed | The defective version returned the documented diagnostic with exit 1; the corrected version returned the complete owned result with exit 0 |
| Local documentation checks | Passed | Relative links, heading anchors, code-fence balance, script names, and four expected-output blocks agree with execution, including expected exit statuses |

Reproduce the combined check from the portfolio root:

```sh
npm run verify
```

The combined suite contains **24 tests**. No dependency installation, credentials, network calls, or external services are involved in these bundled checks. The tests establish the behavior of the fictional examples. The authentication fixture is not a production identity-provider integration; the record filter is not a database engine or authorization system.

## Corrected OpenTelemetry tutorial

Verification used public commit `cc80d436d65e09854102ddb005d11a76bd2a9a60` plus the [correction patch](otel/local-corrections.patch). The separate upstream repository is unchanged. The [tutorial](otel/README.md) supplies setup, failure, recovery, and cleanup commands; the [manifest](otel/correction-manifest.json) records the patch and file hashes.

Environment: Windows, Node.js **24.21.0**, npm **10.9.3**, Docker **29.8.0**, Compose **5.5.1**, Linux containers. The disposable project used application port **18080** and no hosted credentials. Dependencies use the committed lockfile, with package lifecycle scripts disabled.

### What changed after review

The earlier verifier found the expected operations in one stored trace but did not check their parent relationship. Independent review exposed that gap. Normal and recovery checks now require the exact probe, service identity, expected trace ID, and an unambiguous parent chain from inventory through checkout to the root. They reject missing parents, unrelated branches, cycles, and conflicting identifiers or relevant attributes on that path. Split-trace checks validate each operation's separate stored trace; they do not claim ancestry between the two traces.

The following results cover the strengthened validator:

| Check | Result |
| --- | --- |
| OTel test suite | **67 passed**, zero failures or skips; includes 39 focused context/trace checks plus application, launcher, environment-isolation, and Compose-selection regressions |
| Adversarial ancestry fixtures | Valid intermediate paths pass; orphaned, unrelated, cyclic, ambiguous, or incorrectly attributed paths fail. Hexadecimal and Tempo base64 identifiers are covered. |
| Mock OTLP receiver | Explicit SDK, automatic instrumentation, and deliberate broken propagation passed; these process checks establish export to the mock receiver. |
| Healthy backend and fresh recovery | Expected trace and five-span ancestry path verified in Tempo; three correlated Loki records and request/duration metric deltas of one on each run; Alloy receipt/export and processor activity observed |
| Intentional failure | Both exact probe traces retrieved from Tempo with their separate operations and expected identity |
| Negative control | The split-trace verifier rejected the healthy stack with the expected error and exit 1 |
| Patch portability | Applied cleanly to a fresh pinned baseline; all 67 resulting source files matched the corrected copy after LF normalization |
| Cleanup | Zero remaining containers, volumes, or networks for the disposable verification project |

Fresh backend observations on 20 October 2026:

| Stage | Probe | Stored trace evidence |
| --- | --- | --- |
| Baseline | `pipeline-20261020181336-006cad49` | `81777072ff53cc41129b64d9e0a8ac1a`; parent chain verified |
| Intentional failure | `broken-context-198696cd-16aa-4643-a063-6bce70c5fa14` | Checkout `1064c0ae494affb7f6e2bf5f14c29156`; inventory `27f866e8fd5911f9244c13fd9fa4468d` |
| Recovery | `pipeline-20261020181759-2dbb8a9f` | `458a62a5c82210c4524bc3bf417133b6`; new parent chain verified |

Baseline and recovery both established this stored path, with different span IDs on each run:

`HTTP server → checkout.process → HTTP client → HTTP server → inventory.reserve`

The sequence ran with an inherited nonexistent `COMPOSE_FILE`, which the launchers cleared. Earlier setup checks on the same date also exercised the documented temporary PowerShell `RemoteSigned` session under a restricted parent; no saved execution policy was changed.

Alloy exporter failure-counter series were unavailable. That is not evidence of zero exporter failures. This run did not exercise Grafana's UI interactively, native Linux/macOS launchers, hosted export, or private deployments. The UI instructions were checked against official documentation. Earlier scenarios in the upstream project's [dated evidence record](https://github.com/Umphman/otel-onboarding-experience-case-study/blob/cc80d436d65e09854102ddb005d11a76bd2a9a60/docs/evidence/runtime-verification.md) retain their original scope.

## Editorial and disclosure review

The selected samples derive from documentation I authored for Raster/Sonar and the separate public OpenTelemetry case study. New portfolio edits and fictional exercises are labeled. Codex performed the preparation comparisons and checks below; the [AI workflow](AI-WORKFLOW.md) explains its contribution and my review responsibilities.

| Evidence | Review scope |
| --- | --- |
| Saved-item reference | Compared with the original guide, implementation, request validation, and existing test assertions. Private services and databases were not executed. |
| Historical FAQ and new portfolio edit | Checked the original quotations in Git history and the implementation-status guide from the same milestone. The new edit is explicitly separate from the historical wording. |
| Audience and research-authority excerpts | Compared with the engineering, reader-facing, architecture, research-memory, and code-based diligence guides. The diligence map is a technical document; no particular investor receipt or investment decision is inferred. |
| Maintenance examples | Checked revisions that update implementation, operating guidance, and the canonical index, plus the cross-service ownership explanation. These establish the documented changes, not a particular historical AI error or its discoverer. |
| Working practices | My account establishes staff-writer review, code/comment audits, approval responsibilities, GitHub tracking and ownership, and PM/executive prioritization based on blocked parties. |
| Evaluation | My account establishes qualitative customer/investor interviews and feature API usage/adoption comparisons before and after documentation changes. No transcripts, analytics exports, specific results, or documentation-only causal effects are claimed. |

Historical excerpts describe their dated source snapshots. They do not certify the current private deployment. Specific coaching episodes and measured team improvements are not established by the documented ownership practices.

Disclosure review checks retained text for private identifiers, paths, credentials, schemas, routes, commercial rules, research methods, and customer information. Authored quotations are deliberately retained after content review; exact overlap alone is not treated as a disclosure. Raster/Sonar attribution and my professional name are included with my authorization. Private source mappings and audit records remain outside this repository.

Pattern scans and Codex review passes are bounded checks, not guarantees. I remain responsible for the documentation and its public disclosure.
