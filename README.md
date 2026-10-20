# Technical writing portfolio

By **Umphman**.

I write documentation for the Raster/Sonar ecosystem, spanning a frontend application, an AI service, a calculation backend, and a subscription service. My audiences include developers and operators, internal project managers and executives, technical and nontechnical customers, and investors reviewing the project for due diligence.

Two of the three selections below adapt my Raster/Sonar documentation; the other comes from my separate public OpenTelemetry case study. Together they show technical explanation, substantive editing, and precise behavioral reference. I authored the original documentation with AI assistance for refinement and maintenance; new portfolio adaptations are identified.

Raster and Sonar identify the source ecosystem. The excerpts retain anonymized feature names and omit private repository links, customer information, and proprietary implementation details.

## Three selected samples

### Explain and troubleshoot OpenTelemetry onboarding

[Read the selected passages and investigation](samples/observability-onboarding.md).

- **Source:** my separate public OpenTelemetry case study.
- **Intended reader:** developers choosing instrumentation and operators investigating missing telemetry.
- **Problem:** automatic instrumentation has limits, and a healthy application can still have a broken telemetry pipeline.
- **Contribution:** original instrumentation comparison and failure investigation, plus an expanded [runnable tutorial](otel/README.md) prepared during portfolio review.
- **Validation:** local tests and backend failure/recovery checks passed; [results and scope](VERIFICATION.md#corrected-opentelemetry-tutorial).

### Explain AI proposals without implying execution authority

[Read the audience adaptations, review process, and historical before-and-after edit](case-studies/maintaining-documentation-across-services.md).

- **Source:** my Sonar research-platform documentation, with documentation-maintenance guidance from Raster; anonymized excerpts and revisions.
- **Intended reader:** PMs and customers understanding strategies, AI proposals, and research memory; reviewers assessing evidence and readiness for due diligence.
- **Problem:** developer-oriented explanations need different depth for different audiences; “cannot tune automatically” obscures the distinction between useful analysis and permission to apply changes.
- **Contribution:** original explanations, editorial review and approval, and ongoing maintenance; evaluation included interviews and feature usage/adoption comparisons before and after documentation changes.
- **Validation:** historical wording and implementation status checked against source and Git history; the collaboration process comes from my account.

### Specify rename, reset, and no-change behavior

[Read the saved-item display-name reference excerpt](samples/saved-item-display-names.md).

- **Source:** my frontend integration guide for Raster's subscription service; an anonymized behavioral reference.
- **Intended reader:** a frontend engineer implementing an edit form.
- **Problem:** omitted, null, and empty values have different consequences.
- **Contribution:** original integration guide, with source-checked clarification added for this adaptation.
- **Validation:** source and existing test assertions reviewed; private services were not executed.

## How I maintain documentation

GitHub tracking, versioning, and ownership practices provided a shareable record of documentation status and attribution for the team.

The [AI workflow](AI-WORKFLOW.md) draws on my Raster/Sonar documentation work. It explains my review across services, shows how implementation changes affect an operator guide and its canonical index, and records how claims were checked during portfolio preparation.

The supporting [observability excerpt](samples/observability-signal-coverage.md), adapted from my Raster AI-service guide, helps operators choose between metrics, logs, reports, and deployment evidence.

## Verify the bundled examples

Use Node.js 22.18 or later and its bundled npm. Open a terminal in this directory, alongside `package.json`, and run:

```sh
node --version
npm run verify
```

The examples use only the Node.js standard library. They require no package installation, accounts, databases, environment variables, or network access.

This checks the supplementary [missing-record tutorial](samples/troubleshooting-missing-records.md), the [application-session exercise](samples/demo-dashboard-authentication.md), and documentation links and expected output. These two fictional exercises were created with Codex for this portfolio.

The separate OpenTelemetry tutorial needs Docker and public dependencies. Detailed test counts and limitations are in the [verification record](VERIFICATION.md).
