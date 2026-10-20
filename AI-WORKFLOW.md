# How I use AI in documentation work

I authored the original Raster/Sonar documentation and the separate public OpenTelemetry case study. Codex assisted with prose refinement and maintenance as code and versions changed. The examples here draw on Sonar's cross-service documentation and Raster's observability guide and canonical index.

## My review across services

Codex-assisted edits often started from one repository. Before accepting them, I checked related services and documentation to establish which service owned each part of the behavior.

An existing revision distinguishes the backend supplying calculated context, the AI service managing a run and its progress, and the frontend displaying that progress. It also adds a maintenance trigger when ownership changes. Reviewing only the data-producing backend would miss how progress reaches the interface.

During team development, I also audited developers' in-code comments against the implementation before creating, revising, and approving documentation. These checks supplied the context for accepting or changing AI-assisted text.

## Maintaining the canonical documentation

In one recorded change, Raster's AI service gained operator verification scripts and reports. The same commit updated the implementation, observability guide, and canonical documentation index.

The guide classified the additions as on-demand operator tooling, distinguished them from continuously emitted Prometheus metrics and product-facing diagnostics, and located report timing and query diagnostics. The index described the newly available tooling.

The [observability excerpt](samples/observability-signal-coverage.md) preserves the key review decision: an available report does not establish a metric series; the code must register and emit it. This illustrates the maintenance path from implementation to owning guide, canonical entry point, and operating instructions.

## One inspectable review and revision

The [before-and-after FAQ](case-studies/maintaining-documentation-across-services.md#before-and-after) shows a Codex-assisted edit prepared for this portfolio.

| Input or action | Review decision |
| --- | --- |
| Original FAQ, historical revision, and engineering guide from the same change | The FAQ's “should turn those findings into research proposals” leaves availability unclear. |
| Source comparison | Diagnostics and separate historical backtesting were implemented; automatic parameter search, proposal generation, and automatic backtesting of proposals were absent. |
| Codex assistance | Compared passages and drafted a shorter portfolio version separating available behavior, planned automation, and the review path. |

The historical quotations remain unchanged so the new edit is inspectable.

## A repeatable review method

This portfolio makes the review method explicit:

1. Start with the changed implementation, code comments, and owning guide.
2. Use AI to identify affected instructions and draft updates. Check related repositories and service responsibilities before accepting the scope.
3. Check each behavioral claim against evidence: reports do not prove metrics, and intended capabilities do not prove implemented features.
4. Update the canonical entry point and validate procedures. Distinguish source inspection, local execution, and dated deployment observations.

## Preparing this portfolio

Codex helped select, condense, and anonymize existing passages; draft introductions; and compare excerpts with source history. It generated the supplementary fictional tutorials, implementations, tests, and documentation checker, and performed the checks in [VERIFICATION.md](VERIFICATION.md).

For the [OTel tutorial](otel/README.md), Codex generated the correction patch and helped revise and execute the procedure, including the missing checkout probe and tested environment-isolation launchers. Backend traces and a fresh recovery request supply evidence beyond a healthy application response.

I remain responsible for the documentation, selected excerpts, and their public disclosure.
