# Explaining AI proposals without implying execution authority

**Source:** my Sonar research-platform documentation, with documentation-maintenance guidance from Raster. The case combines anonymized excerpts and recorded revisions with my account of working across the ecosystem.

> **Readers:** product managers, customers, investors conducting due diligence, engineers, and operators of a private research platform. **My contribution:** original documentation, review and approval, and ongoing maintenance, with AI assistance. **Sources:** authored guides and recorded revisions from June–September 2026, plus my account of the writing process. The excerpts describe historical source snapshots, not today's deployed system. Feature names and private links are omitted; bracketed substitutions identify anonymized text.

## The reader problem

The original documentation was developer-oriented and highly technical. Other readers needed explanations tailored to their roles and understanding. The audience requirements were:

| Audience | Needed explanation |
| --- | --- |
| Internal project managers and executives | Product mechanics and boundaries at a level they could understand without working through implementation details. |
| External technical readers | Technical guidance for integration and implementation. |
| External nontechnical readers | High-level mechanics and features explained in plain language. |
| Investors and potential investors | What existed, what the evidence supported, and which capabilities remained research-only or blocked. |

For the research platform, product managers and customers specifically needed to understand how strategies were formulated, where AI could modify or propose hypotheses, and how memories affected future backtests and decisions. Explaining what the system could suggest also meant explaining what it could actually change.

I authored the documentation across the participating repositories, with AI assistance to refine and maintain it during development. My collaborators included frontend and backend engineers, staff writers, project managers, the executive team, and customers who relied on the documentation.

## Review, feedback, and prioritization

While I worked with a development team, before later building solo, developers supplied code and in-code comments. I audited both, then created documentation from the verified implementation. I reviewed, changed, and approved all documentation. Staff writers provided internal editorial review.

We used GitHub for documentation tracking and versioning, with defined ownership practices. This provided attribution and a version-controlled record of current documentation status that could be shared across the team.

I conducted user acceptance testing (UAT) as qualitative interviews with a selected cohort of customers and investors. We also used API telemetry and analytics to track usage and adoption of the relevant features. We evaluated documentation changes by comparing interview feedback and feature usage/adoption before and after the revisions.

Revision priorities were discussed with the executive team and PMs, considering which customers or other parties had work paused or blocked.

Documentation remained ongoing work: as implementation and versions changed, I kept the explanations current. In AI-assisted editing, I checked related services across the stack because a draft based on one repository could miss responsibilities or dependencies elsewhere. The [AI workflow](../AI-WORKFLOW.md#my-review-across-services) gives a documented example of those service boundaries.

This describes my working process. The excerpts below show the writing itself; they do not attribute a particular historical revision to a particular interview or telemetry comparison.

## Help external readers interpret the evidence

The engineering reference states a prerequisite for interpreting profit and loss (PnL):

> Sample maturity must be checked before interpreting PnL.

The reader-facing guide explains the distinction between report validity and sample maturity:

> Research trust means the report was generated correctly.
>
> Sample status tells you whether the trading sample is mature enough to interpret.

Its plain-language interpretation is:

> The report is valid, but the sample is too small to make a strategy conclusion.

This gives a reader a useful limit: a correctly generated report can still provide too little evidence for a decision.

The separate code-based due-diligence map opens with its purpose:

> It identifies what exists, what is authoritative, what is research-only, and what must remain blocked.

It then limits what the document establishes:

> It does not certify live-capital readiness. [The platform] remains paper-only.

These passages come from separate existing documents. The engineering reference states a check, the explainer helps a reader interpret a result, and the technical diligence map helps a reviewer assess capability and readiness. Private code references, strategy details, and operational controls are omitted here.

## Before and after

This FAQ revision is preserved in repository history from 15 June 2026. Both versions below retain the original wording. Python was the research component discussed in that historical version of the platform.

**Before**

> **Can Python tune the strategy automatically?**
>
> No. Python can analyze and propose. It cannot mutate live behavior.

**After**

> **Can Python help tune the strategy?**
>
> Yes. That is one of its main jobs.
>
> Python should identify better candidate thresholds, risk controls, stop/target rules, lane-specific weaknesses, and AI-veto failure modes. It should turn those findings into research proposals.
>
> The hard boundary is that Python cannot apply those changes to the running system. A tuning idea must be replayed, reviewed, converted into a new immutable strategy/risk/cost-model version, and then started as a new experiment.

The original question combines two different questions: whether analysis can help improve a strategy, and whether the research component can apply changes automatically. Its opening "No" makes the useful capability easy to miss.

The revision answers the capability question first and gives a concrete path from an idea to a separate experiment. It also makes the restriction specific: generating a proposal does not change the running system.

The historical revision still leaves a gap. "Should turn those findings into research proposals" can sound like an available feature. Its specialist terminology also assumes familiarity with the platform.

The engineering guide updated in the same change supplies the missing status: Python produced diagnostics, while a separate component supported historical replay backtests. Automatic proposal generation and parameter search remained unimplemented.

### A clearer portfolio revision

The following new edit was prepared with Codex for this portfolio. It describes the implementation at that June 2026 milestone:

> **What can Python help with in this version?**
>
> Python explains strategy performance and provides evidence for investigating improvements. The platform also supports historical replay backtests.
>
> Automatic parameter search and proposal generation are planned. Python does not yet generate proposals and send their proposed changes through the backtester automatically.
>
> A tuning idea must be replayed and reviewed before it becomes a new version of the strategy, risk settings, and cost model. That version starts a separate experiment. Python cannot apply the idea to the running system.

This edit gives the reader three separate answers: what is available, what is planned, and what must happen before a change can be used. It removes terms the external reader does not need to understand that boundary.

## Explain the model's role and the memory's role separately

Later authored architecture documentation states the division of responsibility directly:

> The model proposes. [The application] owns data truth, validation, compilation, evaluation, execution semantics, risk, persistence, and authority.

The research-memory guide begins with its purpose and its limits:

> [The platform's] hypothesis research memory records what deterministic research has already learned about a hypothesis so future agentic or human proposal layers do not repeat equivalent tests blindly.
>
> This is a research ledger only. It never approves a strategy, launches a job, compiles a patch, changes risk, changes execution, or mutates live or paper behavior.

These passages answer different parts of the reader's question. A model can propose something to investigate. Recorded outcomes can inform later research and prevent blind repetition. Neither statement transfers permission to change the running system.

The full guides contain the technical contracts behind those statements. This excerpt preserves the explanation without exposing strategy rules, research methods, memory identifiers, storage schemas, or operational controls.

## Maintain the explanation as the implementation changes

The documentation index defines a maintenance order: update the owning repository's implementation guide, then affected cross-repository documentation, then deployment and runbook instructions. It distinguishes implemented behavior, partial behavior, historical context, and planned extensions.

One later audit reconciled current-status claims with source, configuration, scripts, and tests. It separated source verification from local checks and time-bounded operator observations. Older snapshots received a notice pointing to the newer reference:

> Historical snapshot. This document is superseded by [newer current-status reference]. Its dated metrics, commissioning evidence, and addenda remain preserved, but it is not current operating authority.

That notice protects the reading path from search results and saved links. Historical evidence remains available, while the reader has an explicit next step for current guidance.

## What the record establishes

Repository history shows the FAQ, engineering guide, and related documentation changing together. It also preserves the later source audit and historical-status correction. My account supplies the team review and approval process, shared GitHub tracking and ownership practices, prioritization, and evaluation through interviews and API usage/adoption comparisons before and after documentation changes. This portfolio describes that evaluation method without claiming a particular improvement or attributing an adoption increase to a specific revision.

During portfolio preparation, Codex compared these passages with their source files and the before-and-after commit. The current private deployment was not exercised. Detailed verification is recorded in [VERIFICATION.md](../VERIFICATION.md).
