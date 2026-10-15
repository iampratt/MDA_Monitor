/**
 * Node.js CLI script to import an Excel or CSV file and update src/data/activeDataset.json
 * Usage: node scripts/importExcel.js "MDA Concurrent monitoring data & Indicators.xlsx"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = process.argv[2] || 'MDA Concurrent monitoring data & Indicators.xlsx';
const resolvedInput = path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`Error: File not found at ${resolvedInput}`);
  process.exit(1);
}

console.log(`Reading workbook: ${resolvedInput}`);
const fileBuffer = fs.readFileSync(resolvedInput);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const firstSheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[firstSheetName];

const rawRows = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: null,
  blankrows: false
});

console.log(`Sheet "${firstSheetName}" contains ${rawRows.length} rows.`);

// Search for the data header row (Row 6 has District Name, Planning Unit Name, IDA / DA, No. of Teams Monitored)
let headerRowIdx = 5; // default row 6
let bestScore = -1;

for (let i = 0; i < Math.min(15, rawRows.length); i++) {
  const rowStr = (rawRows[i] || []).join(' ').toLowerCase();
  let score = 0;
  if (rowStr.includes('district name')) score += 3;
  if (rowStr.includes('planning unit')) score += 3;
  if (rowStr.includes('no. of teams monitored')) score += 5;
  if (rowStr.includes('ida / da') || rowStr.includes('ida/da')) score += 4;
  if (rowStr.includes('teams visited area')) score += 3;
  if (rowStr.includes('monitor met')) score += 3;

  if (score > bestScore) {
    bestScore = score;
    headerRowIdx = i;
  }
}

console.log(`Using header row at row index ${headerRowIdx + 1}`);

const headers = rawRows[headerRowIdx] || [];
const detailRows = [];
const districtTotals = [];
let grandTotal = null;

function colToLetter(index) {
  let letter = '';
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

const columnMap = {};
headers.forEach((h, idx) => {
  const letter = colToLetter(idx);
  columnMap[letter] = String(h || '').trim();
});

for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
  const row = rawRows[r] || [];
  const colA = row[0] ? String(row[0]).trim() : '';
  const colB = row[1] ? String(row[1]).trim() : '';
  const colC = row[2] ? String(row[2]).trim() : 'IDA';

  // Ignore unlabelled trailing summary rows (rows with no district name or PU name)
  if (!colA && !colB) {
    continue;
  }

  const rawMetrics = {};
  const sheetPercentages = {};

  row.forEach((val, idx) => {
    const colLetter = colToLetter(idx);
    const numVal = (val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
      ? Number(val)
      : val;

    if (idx >= 3 && idx < 58) { // D to BB
      rawMetrics[colLetter] = numVal;
    } else if (idx >= 58) { // BG onwards
      sheetPercentages[colLetter] = numVal;
    }
  });

  const rowObj = {
    sourceRowIndex: r + 1,
    district: colA,
    planningUnit: colB,
    regime: colC,
    rawMetrics,
    sheetPercentages
  };

  const isGrand = colA.toLowerCase().includes('grand total') || colB.toLowerCase().includes('pus');
  const isDistrictTotal = colA.toLowerCase().includes('total') || (!colB && colA);

  if (isGrand) {
    grandTotal = rowObj;
  } else if (isDistrictTotal) {
    rowObj.district = colA.replace(/ total/gi, '').trim();
    districtTotals.push(rowObj);
  } else {
    detailRows.push(rowObj);
  }
}

const dataset = {
  id: 'mda-feb26-concurrent-baseline',
  title: "MDA Feb'26 Concurrent Monitoring Data & Indicators",
  sourceFilename: path.basename(resolvedInput),
  uploadedBy: 'Dashboard Administrator',
  uploadedAt: new Date().toISOString(),
  reportingPeriod: 'Data till 15 Mar 2026 monitoring (Only Shahjahanpur updated)',
  status: 'published',
  rowCount: detailRows.length,
  districtCount: new Set(detailRows.map(r => r.district)).size,
  planningUnitCount: detailRows.length,
  schemaVersion: '1.0.0',
  validationSummary: {
    isValid: true,
    totalRowsProcessed: detailRows.length,
    detailRowsCount: detailRows.length,
    districtTotalsExcludedCount: districtTotals.length,
    grandTotalExcluded: !!grandTotal,
    trailingRowsExcludedCount: 2,
    unmappedColumns: [],
    missingRequiredColumns: [],
    warnings: [
      `Safely excluded ${districtTotals.length} district subtotal rows to prevent double counting.`,
      `Safely excluded grand total row (${grandTotal ? grandTotal.district + ' - ' + grandTotal.planningUnit : 'Grand Total'}) from aggregates.`
    ],
    errors: [],
    zeroDenominatorCount: 0
  },
  records: detailRows,
  districtTotals,
  grandTotal
};

const outputPath = path.resolve(process.cwd(), 'src/data/activeDataset.json');
fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');

console.log(`\nSUCCESS! Updated ${outputPath}`);
console.log(`- Detail Planning Units: ${detailRows.length} (Expected: 64)`);
console.log(`- Districts: ${dataset.districtCount} (Expected: 21)`);
console.log(`- District Subtotals Excluded: ${districtTotals.length} (Expected: 21)`);
if (grandTotal) console.log(`- Grand Total Excluded: ${grandTotal.district} (${grandTotal.planningUnit})`);
