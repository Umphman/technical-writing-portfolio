# How I use AI in documentation work

I authored the original documentation for the Raster/Sonar ecosystem and the separate public OpenTelemetry case study. The anonymized examples below draw on Sonar's cross-service documentation and Raster's observability guide and canonical index. I used Codex to refine the prose and assist with updates as we changed code and versions during development, including maintaining canonical current-status documentation.

## My review across services

Codex-assisted edits often started from the code in one repository. I cross-referenced documentation and checked the related services across the stack before accepting those edits. My review established which service owned each part of the behavior and whether the explanation remained accurate across their boundaries.

An existing documentation revision illustrates that concern. It distinguishes the backend supplying calculated context, the AI service managing a run and its progress, and the frontend displaying that progress. The revision also adds a maintenance trigger for changes to that ownership.

Looking at only the data-producing backend would leave the reader without the full explanation of how progress reaches the interface. The cross-service guide makes those responsibilities explicit. This summary condenses an existing documentation revision and illustrates the scope I check across services.

During team development, my inputs included developers' in-code comments, which I audited against the implementation before creating, revising, and approving documentation. That code review and my review across services supplied the context for accepting or changing AI-assisted text.

## Maintaining the canonical documentation

In one recorded change, an AI service gained operator verification scripts and reports. The same commit updated the implementation, the observability guide, and the canonical documentation index.

The guide classified those additions as on-demand operator tooling. They were not continuously emitted Prometheus metrics or product-facing diagnostics. It also told operators where report timing and query diagnostics were available. The index then described the newly available tooling.

This is the kind of maintenance I use AI to assist: follow the implementation change into its owning guide, then update the canonical entry point and affected operating instructions. The [observability excerpt](samples/observability-signal-coverage.md) retains the important distinction. An available report does not establish the existence of a metric series; the code must register and emit that metric.

## One inspectable review and revision

The [before-and-after FAQ](case-studies/maintaining-documentation-across-services.md#before-and-after) provides a concrete example from this portfolio's preparation. The historical revision improved the distinction between research and execution, but its phrase "should turn those findings into research proposals" still left availability unclear.

| Step | Evidence and action |
| --- | --- |
| Starting inputs | My original FAQ, its recorded before-and-after revision, and the engineering guide from the same revision. |
| Codex assistance | Compared the passages, condensed the explanation, and drafted a new portfolio version. |
| Check | The engineering guide listed Python diagnostics and separate historical backtesting as implemented. Automatic parameter search, proposal generation, and automatic backtesting of proposals were still absent. |
| Resulting revision | The new text states available functionality, planned automation, and the review path in separate paragraphs. It preserves the historical quotations so the change remains inspectable. |

This is a documented Codex-assisted portfolio edit. The historical evidence used here consists of the original documentation and its revision history.

## A repeatable review method

The portfolio preparation makes the following method explicit, incorporating my review across services:

1. Start with the changed implementation, its code comments, and the guide that owns its explanation.
2. Use AI to identify affected instructions and draft updates. Check related repositories and service responsibilities before accepting the proposed scope.
3. Check each behavioral claim against its evidence. For example, an operator report is not evidence of a continuously emitted metric; an intended capability is not evidence of an implemented feature.
4. Update the canonical entry point and validate procedures at the level claimed. Record whether the evidence is a source inspection, a local execution, or a dated deployment observation.

These steps are a reusable review method documented for this portfolio.

## Preparing this portfolio

Codex helped select and condense my existing passages, anonymize private examples, draft the portfolio introductions, and compare excerpts with source and revision history. It generated the supplementary fictional tutorials, their implementations and tests, and the documentation checker. Codex also performed the preparation checks recorded in [VERIFICATION.md](VERIFICATION.md).

For the [OTel tutorial](otel/README.md), Codex generated the local correction patch and helped revise and execute the procedure. The preparation review corrected a missing checkout-probe step and replaced vague environment-isolation advice with tested launchers. Verification checks actual backend traces and a fresh recovery request; a healthy application response alone would not support the claim.

I remain responsible for the documentation, the selected excerpts, and their public disclosure.
