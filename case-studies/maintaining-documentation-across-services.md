# Explaining AI proposals without implying execution authority

- **Source/version:** Sonar research-platform guides and Raster maintenance guidance, June–September 2026 snapshots.
- **Readers:** PMs, customers, due-diligence reviewers, engineers, and operators.
- **Contribution:** original documentation, review and approval, and maintenance, with AI assistance.
- **Validation:** source and revision-history comparison; team and evaluation practices are my account. Current private deployment was not exercised.

Feature names and private links are omitted; bracketed substitutions identify anonymized text. Historical excerpts describe their dated versions.

## Before and after

The FAQ revision below is preserved in repository history from **15 June 2026**. Both historical quotations retain their original wording.

**Before — historical FAQ**

> **Can Python tune the strategy automatically?**
>
> No. Python can analyze and propose. It cannot mutate live behavior.

**After — historical revision, 15 June 2026**

> **Can Python help tune the strategy?**
>
> Yes. That is one of its main jobs.
>
> Python should identify better candidate thresholds, risk controls, stop/target rules, lane-specific weaknesses, and AI-veto failure modes. It should turn those findings into research proposals.
>
> The hard boundary is that Python cannot apply those changes to the running system. A tuning idea must be replayed, reviewed, converted into a new immutable strategy/risk/cost-model version, and then started as a new experiment.

**Editorial problem:** the original question conflates useful analysis with permission to apply changes. The revision separates those ideas, but “should turn those findings into research proposals” still makes planned automation sound available. The engineering guide updated in the same change lists Python diagnostics and separate historical replay backtests as implemented; automatic proposal generation and parameter search remained unimplemented.

### A clearer portfolio revision

**New edit, prepared with Codex for this portfolio.** It describes the June 2026 milestone, not a later deployment:

> **What can Python help with in this version?**
>
> Python explains strategy performance and provides evidence for investigating improvements. The platform also supports historical replay backtests.
>
> Automatic parameter search and proposal generation are planned. Python does not yet generate proposals and send their proposed changes through the backtester automatically.
>
> A tuning idea must be replayed and reviewed before it becomes a new version of the strategy, risk settings, and cost model. That version starts a separate experiment. Python cannot apply the idea to the running system.

The edit answers three questions in order: what is available, what is planned, and what must happen before a change can be used. It also removes specialist terms unnecessary to understanding that boundary.

## The reader problem

The original documentation was developer-oriented. I adapted explanations for different readers:

| Audience | Needed explanation |
| --- | --- |
| Internal PMs and executives | Product mechanics and boundaries without implementation detail. |
| External technical readers | Integration and implementation guidance. |
| External nontechnical readers | High-level mechanics in plain language. |
| Investors and potential investors | What existed, what evidence supported it, and what remained research-only or blocked. |

PMs and customers needed to understand strategy formulation, AI proposals, and how research memory affected future backtests and decisions. The examples below show how I separated those concepts.

## Help external readers interpret the evidence

The engineering reference states a prerequisite for interpreting profit and loss (PnL):

> Sample maturity must be checked before interpreting PnL.

The reader-facing guide explains the distinction:

> Research trust means the report was generated correctly.
>
> Sample status tells you whether the trading sample is mature enough to interpret.

Its plain-language interpretation is:

> The report is valid, but the sample is too small to make a strategy conclusion.

This turns an engineering check into a decision boundary a reader can use.

The separate code-based due-diligence map states its purpose:

> It identifies what exists, what is authoritative, what is research-only, and what must remain blocked.

It also limits its claim (**historical source snapshot, June–September 2026**):

> It does not certify live-capital readiness. [The platform] remains paper-only.

These excerpts come from separate existing documents. Private code references, strategy details, and operational controls are omitted.

## Explain the model's role and the memory's role separately

Later authored architecture documentation states the division of responsibility:

> The model proposes. [The application] owns data truth, validation, compilation, evaluation, execution semantics, risk, persistence, and authority.

The research-memory guide gives its purpose and limits:

> [The platform's] hypothesis research memory records what deterministic research has already learned about a hypothesis so future agentic or human proposal layers do not repeat equivalent tests blindly.
>
> This is a research ledger only. It never approves a strategy, launches a job, compiles a patch, changes risk, changes execution, or mutates live or paper behavior.

A model can propose an investigation; recorded outcomes can inform later research. Neither transfers permission to change the running system. The excerpt omits strategy rules, research methods, memory identifiers, storage schemas, and operational controls.

## Review, feedback, and prioritization

During team development, before later building solo, frontend and backend engineers supplied code and in-code comments. I audited those inputs, authored the documentation across the participating repositories, and reviewed, changed, and approved it. Staff writers provided internal editorial review. I used AI to refine and maintain the documentation as implementation changed.

We used GitHub for tracking and versioning, with defined ownership practices and a shareable record of documentation status and attribution. I discussed revision priorities with PMs and the executive team, considering which customers or other parties had work paused or blocked.

I conducted user acceptance testing through qualitative interviews with a selected cohort of customers and investors. We also used API telemetry and analytics to track relevant feature usage and adoption. Our evaluation method compared interview feedback and usage/adoption before and after documentation changes. No specific improvement or causal adoption result is claimed here, and these methods are not tied to a particular excerpted revision.

For AI-assisted edits, I checked related services because a draft based on one repository could miss responsibilities elsewhere. The [AI workflow](../AI-WORKFLOW.md#my-review-across-services) gives a concrete example.

## Maintain the explanation as the implementation changes

The documentation index defines the update order: the owning repository's implementation guide, affected cross-repository documentation, then deployment and runbook instructions. It distinguishes implemented, partial, historical, and planned behavior.

A later audit reconciled status claims with source, configuration, scripts, and tests, separating source inspection from local checks and dated operator observations. Older snapshots received this notice:

> Historical snapshot. This document is superseded by [newer current-status reference]. Its dated metrics, commissioning evidence, and addenda remain preserved, but it is not current operating authority.

The notice gives readers arriving through search or saved links a route to current guidance while preserving the historical evidence.

## What the record establishes

Repository history records the FAQ and engineering guide changing together, plus the later source audit and historical-status correction. Codex compared these passages with source and history during portfolio preparation. The [verification record](../VERIFICATION.md) holds the detailed audit trail.
