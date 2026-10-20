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

Verification used an isolated copy of public commit `cc80d436d65e09854102ddb005d11a76bd2a9a60` plus the [local correction patch](otel/local-corrections.patch). The public repository was not changed. The [tutorial](otel/README.md) supplies the exact setup, failure, recovery, and cleanup commands.

Environment: Windows, Node.js **24.21.0**, npm **10.9.3**, Docker **29.8.0**, Compose **5.5.1**, Linux containers. Dependencies came from the committed lockfile, with package lifecycle scripts disabled during installation. The test project used host port **18080** because port 8080 could not be bound on this machine.

| Check | Result |
| --- | --- |
| Node.js test suite | 31 passed, zero failed, zero skipped on the tested Windows/Git Bash environment |
| Explicit SDK with mock OTLP receiver | Passed for trace, metric, and log export; structured logs correlated |
| Configured automatic instrumentation with mock receiver | Passed for trace, metric, and log export; structured logs correlated |
| Deliberately broken propagation with mock receiver | Passed: the expected context split was observed |
| Environment isolation | All three signal scenarios passed with conflicting inherited endpoints, headers, SDK disabling, sampling, and propagation settings |
| PowerShell and POSIX launchers | Passed invalid-preload checks before Node/npm startup; PowerShell argument-forwarding regression passed; POSIX launcher exercised using Git Bash on Windows |
| Compose-file selection | Actual Compose configuration checks passed with inherited files pointing to a nonexistent path and an unrelated valid project; both launchers and the shared verifier selected the intended checkout |
| Windows script-policy prerequisite | The audit reproduced the `Restricted` block. A temporary `RemoteSigned` child process ran the launcher and backend sequence under a restricted parent; no saved policy was changed |
| Healthy local pipeline | Passed: Alloy activity, connected Tempo trace, correlated Loki records, and Prometheus metric deltas |
| Broken-context local pipeline | Passed: a new identified checkout produced two distinct traces, both retrieved from Tempo with the expected probe, service identity, and separate operations |
| Recovery | Passed with a fresh checkout probe after recreating the default stack |
| Negative control | The broken-context verifier correctly rejected the healthy stack with exit 1 |
| Patch portability | `git apply --check` and application passed against a fresh baseline; all 67 resulting source files matched the corrected copy after LF normalization |

The 31 tests include ten added checks for environment isolation, argument forwarding, Compose-file selection, and split-trace validation. Process-level signal checks used a local mock receiver earlier on the same date. The final setup pass reran the full test suite and backend failure/recovery sequence using the corrected Compose selection.

The final backend run used a nonexistent inherited `COMPOSE_FILE`, a parent process with `Restricted` script policy, and temporary `RemoteSigned` child processes. It used a separate disposable Compose project with Alloy, Tempo, Loki, and Prometheus; no hosted telemetry destination or paid provider was used. Cleanup removed that project's containers, volumes, and network.

These are the final backend observations from 20 October 2026:

| Stage | Probe | Result |
| --- | --- | --- |
| Baseline | `pipeline-20261020162521-acd727bf` | Connected trace `051e841b5406650fc8ff6133da95248c`; three correlated log records; request and duration counts each increased by one |
| Intentional failure | `broken-context-460b8295-dad9-4b14-a6bb-2db209e5cc24` | Checkout trace `dd5e6bf9063a2c77170ab598b2e75147`; inventory trace `4b4bd4dccfd15dbff17532eb8610cd71`; both stored in Tempo |
| Recovery | `pipeline-20261020162807-6f9a5364` | Connected trace `24b8a4693fd56771644cb8feb491ebde`; three correlated log records; request and duration counts each increased by one |

Alloy exporter failure-counter series were unavailable in the baseline and recovery runs. This is a limitation, not evidence of zero exporter failures. Earlier bad-endpoint and other scenario observations remain in the public project's [dated evidence record](https://github.com/Umphman/otel-onboarding-experience-case-study/blob/cc80d436d65e09854102ddb005d11a76bd2a9a60/docs/evidence/runtime-verification.md); they were not all rerun.

The patch and its individual source-file hashes are recorded in the [correction manifest](otel/correction-manifest.json). The causal explanation was compared with the application's context-reset code, and the Grafana inspection steps were checked against its official trace-ID query instructions; this pass did not exercise the UI interactively. Linux/macOS execution and hosted export were not tested. Local passing checks do not establish production readiness or usability with an independent reader.

## Editorial and disclosure review

The three selected samples feature existing authored documentation: public OpenTelemetry writing, an anonymized behavior-reference excerpt, and an audience and editing case with a substantive historical FAQ revision. A supporting observability excerpt also comes from an existing private guide. The author confirmed original authorship across the repositories and AI-assisted refinement and maintenance as development progressed.

The integration excerpt was compared with its original guide, relevant implementation, and existing test assertions; private tests were not rerun. The FAQ before and after were checked in Git history. Retained passages explaining proposal authority and research memory were checked against their original documents. The AI workflow includes a commit that updates implementation, the operator guide, and the documentation index together. These are source and provenance checks, not a fresh assessment of private runtime behavior.

The case also contains a clearly labeled new portfolio revision checked against the historical implementation-status guide. Additional excerpts from the existing reader-facing explainer and code-based due-diligence map demonstrate how the writing explains evidence and limits. The diligence map is identified as a technical document; its inclusion does not imply that it was an investor brochure or that a particular recipient received it.

The author confirmed internal editorial review by staff writers, UAT conducted as qualitative interviews with selected customers and investors, and revision prioritization with executives and PMs based on blocked parties. The author also confirmed that interview feedback and API usage/adoption telemetry for the relevant features were benchmarked before and after documentation changes. This establishes the reported evaluation method; no interview transcripts, analytics exports, comparison values, or specific results are included in the portfolio. The account does not establish that documentation alone caused any change in adoption.

During team development, developers supplied code comments; the author audited the code and comments, created documentation, and reviewed, changed, and approved it. These workflow details come from the author's account. They are not inferred from commits, and they do not establish a specific project duration or investment outcome.

The author also confirmed GitHub-based documentation tracking, versioning, and ownership practices that provided attribution and a shareable record of current documentation status. The portfolio describes this as a team practice. It does not infer individual coaching sessions, specific GitHub enforcement mechanisms, automated status checks, or measured improvements in team performance.

The author also described checking related services across the stack when Codex-assisted edits began from a single repository. A historical documentation revision corroborates the distinction between a data-producing backend, the AI service's run/progress ownership, and frontend presentation. It supports the example's content, not a claim that the record captures a particular AI error or the person who identified it.

The two supplementary executable tutorials use newly invented applications and data. The OTel project also uses its existing synthetic checkout workload. Review checked the complete portfolio for private paths, production identifiers, credentials, internal schemas and routes, commercial rules, research methods, unsupported outcomes, and misleading attribution.

Retained wording from authored private documentation is intentional. Exact-phrase matches are reviewed for their content and recorded separately from potential disclosures; rewriting every sentence until it no longer matches would erase the samples' provenance. The source mappings and review records remain outside the candidate publication directory.

Automated pattern checks and separate Codex review passes support this assessment. The author remains responsible for the selected excerpts and the scope of their public disclosure.

The corrected OTel procedure adds the missing checkout request, explains the context reset, verifies the exact split traces, and requires fresh recovery evidence. Its launchers replace the ambiguous instruction to use a clean terminal, isolate inherited Compose-file selection, and document the Windows script-policy prerequisite. These fixes are included in this portfolio and verified above; the pinned upstream repository has not been changed.
