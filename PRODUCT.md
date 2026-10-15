# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **State & Program Directors**: Monitor executive programmatic KPIs, district performance rankings, and campaign benchmarks across coverage, logistics, and supervisory metrics to allocate state-level resources.
- **Field Supervisors & Data Analysts**: Drill down into specific districts and planning units, analyze bottleneck indicators (e.g., drug administration rate, DA training, microplan compliance), and export filtered datasets for targeted field interventions.
- **M&E Administrators**: Upload daily field monitoring spreadsheets (.xlsx/.csv), inspect column mappings, validate data integrity, and commit updated dataset versions.

## Product Purpose

MDA Monitor is a public, browser-based concurrent monitoring dashboard for active Mass Drug Administration (MDA) field campaigns. It provides real-time visibility into campaign execution across districts and planning units, enabling public health leadership and field supervisors to detect gaps in coverage, logistics, and training early enough to intervene before the campaign window closes.

## Positioning

A zero-backend, client-side operational dashboard that eliminates server/database infrastructure by reading from and updating a versioned JSON dataset (`src/data/activeDataset.json`). Combines robust in-browser spreadsheet ingestion, GitHub API sync, and strict raw-count mathematical aggregations that prevent percentage-averaging distortions common in ad-hoc monitoring tools.

## Operating Context

- **Campaign Cadence**: High-intensity 5- to 10-day field campaigns (e.g., Lymphatic Filariasis eradication).
- **Environment**: Desktop and laptop screens in state/district command centers, and field laptops/tablets during supervisory rounds.
- **Data Inputs**: Daily field monitoring spreadsheets (.xlsx, .xls, .csv) containing individual planning unit rows mixed with district subtotal rows and varying header formats.

## Capabilities and Constraints

- **Four Functional Workspaces**:
  - *Management Overview*: Executive KPI summary cards, interactive district performance rankings with benchmark lines, Top 5 & Bottom 5 priority comparisons, and thematic readiness pillars.
  - *Analyst Workbench*: Multi-level faceted filters (district, planning unit, thematic category, indicator, regime), planning unit comparative chart, sortable/paginated data table, and CSV exporter.
  - *Indicator Catalog*: Comprehensive dictionary of programmatic indicators, mathematical formulas, directional polarity, and target thresholds.
  - *Admin Portal*: Spreadsheet drag-and-drop upload, multi-sheet inspection, header row auto-detection, alias-based column normalization, subtotal row isolation, version rollback history, and optional in-browser GitHub API commit.
- **Mathematical Integrity Rules**:
  - All aggregate percentages strictly calculated as $100 \times \frac{\sum \text{Numerators}}{\sum \text{Denominators}}$. Never average percentages.
  - Detail planning unit records (64 units) must be strictly isolated from precomputed district subtotal rows (21 rows) to eliminate double-counting.
  - Zero denominators output `N/A` with neutral status; raw counts are preserved for full auditability.
- **Technical Architecture**: React 18, TypeScript, Tailwind CSS, Recharts, Vite, with client-side JSON state persistence.

## Brand Commitments

- **Product Name**: MDA Monitor (Concurrent Monitoring Dashboard).
- **Tone & Voice**: Authoritative, clean, data-dense, public health operational tool.

## Evidence on Hand

- Bundled production dataset: [activeDataset.json](file:///Users/pratt/Documents/WorkCC/mdamonitor/src/data/activeDataset.json) (2,202 teams monitored across 64 planning units and 21 districts).
- Baseline indicator dictionary: [indicators.ts](file:///Users/pratt/Documents/WorkCC/mdamonitor/src/data/indicators.ts).
- Reference field workbook: [MDA Concurrent monitoring data & Indicators.xlsx](file:///Users/pratt/Documents/WorkCC/mdamonitor/MDA%20Concurrent%20monitoring%20data%20%26%20Indicators.xlsx).

## Product Principles

- **Operational Immediacy**: Provide instant visual answers to "where is the campaign lagging?" without latency or manual calculation.
- **Mathematical Rigor**: Guarantee zero percentage-averaging and zero subtotal double-counting across all aggregations.
- **Infrastructure Simplicity**: Keep the app entirely browser-executable and self-contained without mandatory server or database dependencies.
- **Actionable Contrast**: Use explicit performance threshold bands (Green $\ge 90\%$, Amber $75\text{--}89\%$, Red $< 75\%$) against benchmark targets so priority supervisory needs are unmistakable.
