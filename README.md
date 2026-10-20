# Technical writing portfolio

By **Michael Gomez Wood** (**Umphman** on GitHub).

I write documentation across the Raster/Sonar ecosystem: a frontend application, an AI service, a calculation backend, and a subscription service. My readers include developers, operators, PMs and executives, technical and nontechnical customers, and investors conducting due diligence.

The first two samples adapt my Raster/Sonar documentation; the third comes from my separate public OpenTelemetry case study. I authored the originals with AI assistance for refinement and maintenance. New portfolio edits are labeled.

The excerpts anonymize feature names and omit private links, customer information, and proprietary implementation details.

## Three selected samples

### Explain AI proposals without implying execution authority

[Read the before-and-after edit and cross-service writing case](case-studies/maintaining-documentation-across-services.md).

- **Source:** Sonar research-platform guides and Raster maintenance guidance; June–September 2026 snapshots.
- **Reader:** PMs, customers, and due-diligence reviewers.
- **Contribution:** original explanations, editorial review, and maintenance; a new edit separates available analysis, planned automation, and permission to apply changes.
- **Validation:** source and Git-history comparison; collaboration and evaluation methods are my account.

### Specify rename, reset, and no-change behavior

[Read the saved-item display-name reference excerpt](samples/saved-item-display-names.md).

- **Source:** my frontend integration guide for Raster's subscription service.
- **Reader:** a frontend engineer implementing an edit form.
- **Contribution:** original reference; this adaptation clarifies the different consequences of omitted, null, and empty values.
- **Validation:** source and existing test assertions reviewed; no private service execution.

### Explain and troubleshoot OpenTelemetry onboarding

[Read the selected passages and investigation](samples/observability-onboarding.md), then try the [runnable tutorial](otel/README.md).

- **Source:** my separate public OpenTelemetry case study.
- **Reader:** developers choosing instrumentation and operators investigating missing telemetry.
- **Contribution:** original instrumentation comparison and failure investigation, plus a tutorial expanded during portfolio review.
- **Validation:** local tests and backend failure/recovery checks; [results and scope](VERIFICATION.md#corrected-opentelemetry-tutorial).

## How I maintain documentation

The [AI workflow](AI-WORKFLOW.md) shows my review across services and how implementation changes affect an operator guide and its canonical index. The writing case describes team review, GitHub tracking and ownership, and evaluation through interviews and API telemetry.

The supporting [observability excerpt](samples/observability-signal-coverage.md), from my Raster AI-service guide, helps operators choose between metrics, logs, reports, and deployment evidence.

## Verify the bundled examples

Use Node.js 22.18 or later and its bundled npm. Open a terminal in this directory, alongside `package.json`, and run:

```sh
node --version
npm run verify
```

The examples use only the Node.js standard library. They require no package installation, accounts, databases, environment variables, or network access.

This checks the supplementary [missing-record tutorial](samples/troubleshooting-missing-records.md), the [application-session exercise](samples/demo-dashboard-authentication.md), and documentation links and expected output. These two fictional exercises were created with Codex for this portfolio.

The separate OpenTelemetry tutorial needs Docker and public dependencies. Detailed test counts and limitations are in the [verification record](VERIFICATION.md).
