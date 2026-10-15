# MDA Monitor — Concurrent Monitoring Dashboard

A public, browser-based monitoring dashboard for Mass Drug Administration (MDA) field campaigns. Built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

The application eliminates the need for any external database or complex backend infrastructure by maintaining the published dataset directly in the codebase as a versioned JSON (`src/data/activeDataset.json`), allowing instant updates via browser upload, GitHub API commit, or local CLI import.

---

## 🌟 Key Features

### 1. Management Overview (Executive View)
- **Top Programmatic KPI Summary Cards**:
  - **Teams Monitored**: 2,202 teams across 64 Planning Units and 21 Districts.
  - **Teams Visited Area**: 92.8% (Target: 95%).
  - **Working as per Microplan**: 78.7% (Target: 90%).
  - **Both DA Trained**: 71.5% (Target: 90%).
  - **Drug Administration Rate (Directly Observed)**: 54.3% (Target: 80%).
  - **Supervisor Visited**: 82.6% (Target: 90%).
- **Interactive District Performance Ranking Chart**:
  - Horizontal bar chart ranking all 21 districts.
  - Color-coded performance bands (Green $\ge$ 90%, Amber 75–89%, Red < 75%).
  - Real-time State Benchmark Reference Line and Target Reference Line.
  - Switchable metrics directly from the dropdown.
- **Top 5 & Bottom 5 Districts**:
  - Side-by-side comparison showing highest performers and districts needing priority supervisory support with delta against state aggregate.
- **Thematic Pillar Readiness**:
  - Summary cards across Coverage, Logistics, Microplan, Training, Knowledge, Drugs, Administration, Refusal, Documentation, and Supervision.

### 2. Analyst Workbench (Drill-Down View)
- **Multi-Level Filters**:
  - District dropdown (All Districts or specific district).
  - Planning Unit dropdown (dynamically filtered by selected district).
  - Thematic Category selector.
  - Indicator selector.
  - Real-time text search.
- **Planning Unit Comparison Chart**:
  - Visualizes individual planning unit performance against the benchmark target line.
- **Sortable & Paginated Data Table**:
  - Columns: District, Planning Unit, Regime (IDA/DA), Teams Monitored, Numerator (Count), Denominator (Base), Calculated %, Target, and Health Status.
  - Sort by any column (ascending/descending).
- **CSV Data Exporter**:
  - One-click export of current filtered rows as a clean CSV file.

### 3. Indicator Catalog
- Complete dictionary of all indicators, code letters (e.g. `BG`, `CJ`, `BM`), exact mathematical formulas ($100 \times \text{Numerator} / \text{Denominator}$), direction (High is good / Low is good / Neutral), and target thresholds.

### 4. Admin Portal & Upload
- **Drag & Drop Upload**: Supports `.xlsx`, `.xls`, and `.csv` files up to 20MB.
- **Multi-Sheet Inspection**: Inspects all sheets (e.g. `Sheet1`, `Sheet2`) with row/column counts.
- **Header Row Auto-Detection**: Automatically identifies data headers (e.g. Row 6) and allows overriding.
- **Column Normalization & Mapping**: Robust alias-based matching handles rearranged columns, capitalization, punctuation, and extra whitespace.
- **Data Integrity Safeguards**:
  - Automatically isolates and excludes district subtotal rows (21 rows in sample) and grand-total rows from detail aggregations to prevent double counting.
  - Guarded against zero denominators ($N/A$ instead of division by zero).
  - Raw counts preserved for full transparency.
- **Version History & Rollback**:
  - Stores uploaded versions with one-click rollback.

---

## 🚀 How Data Updates Work (Codebase / GitHub Architecture)

You do **not** need Supabase or any database. The dashboard reads directly from `src/data/activeDataset.json`. When you have a new Excel or CSV file, you have three simple options:

### Option A: In-Browser Upload + Direct GitHub Commit (Recommended for Production)
1. Go to the **Admin Portal & Upload** tab in the dashboard.
2. Click **GitHub Sync Settings** and enter your repository details:
   - Owner/Org (e.g. `your-username`)
   - Repository Name (e.g. `mdamonitor`)
   - Branch (e.g. `main`)
   - Target Path: `src/data/activeDataset.json`
   - Personal Access Token (PAT with `contents:write` scope).
3. Upload your new Excel/CSV file, review the preview and validation metrics.
4. Click **Commit to GitHub**.
5. The browser commits the updated JSON directly to your GitHub repository via GitHub's API. This automatically triggers a deployment on **Vercel** or **GitHub Pages**, updating the permanent URL for everyone!

### Option B: In-Browser Upload + Download JSON
1. Upload your new Excel file in the Admin Portal.
2. Click **Download activeDataset.json**.
3. Replace `src/data/activeDataset.json` in your repository and commit with Git.

### Option C: Local CLI Command (Instant 1-Second Update)
From your terminal, run:
```bash
npm run update-data "path/to/new_file.xlsx"
```
This reads the Excel workbook, auto-detects headers, separates detail planning units, excludes subtotal rows, and writes `src/data/activeDataset.json` automatically.

---

## 🛠️ Local Development & Scripts

### Start Development Server
```bash
npm run dev
```
Opens the dashboard at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Type-checks with `tsc` and bundles optimized production assets with Vite.

### Preview Production Bundle
```bash
npm run preview
```

### Import / Refresh Data CLI
```bash
npm run update-data
# or specify another file:
npm run update-data "path/to/another_file.xlsx"
```

---

## 📐 Mathematical Formulation & Data Integrity

Every percentage indicator is strictly calculated as:
$$\text{Percentage} = 100 \times \frac{\sum(\text{Numerator})}{\sum(\text{Denominator})}$$

- **No Averaging of Percentages**: District-level and state-level indicators never take an average of underlying percentages; they sum raw counts across all filtered planning units before computing the ratio.
- **Exclusion of Subtotals**: Detail records (64 planning units) are strictly separated from precomputed district total rows (21 rows) and grand total rows to ensure zero double-counting.
- **Zero Denominator Handling**: When denominator is 0, the indicator displays `N/A` with neutral status rather than `Infinity` or `NaN`.
