import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read active dataset
const datasetPath = path.resolve(__dirname, '../src/data/activeDataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
const records = dataset.records;

// Define indicators
const indicators = [
  { code: 'BG', name: '% Teams Visited Area', numField: 'E', denField: 'D', category: 'Coverage' },
  { code: 'BH', name: '% Teams Not Found Working', numField: 'F', denField: 'D', category: 'Coverage' },
  { code: 'BI', name: '% Not Working: Team Not Turned Up', numField: 'G', denField: 'F', category: 'Reasons Not Working' },
  { code: 'BJ', name: '% Not Working: Drug Not Received', numField: 'H', denField: 'F', category: 'Reasons Not Working' },
  { code: 'BK', name: '% Not Working: DA Exhausted Drug', numField: 'I', denField: 'F', category: 'Reasons Not Working' },
  { code: 'BL', name: '% Not Working: Other Reasons', numField: 'J', denField: 'F', category: 'Reasons Not Working' },
  { code: 'BM', name: '% Teams Working as per Microplan', numField: 'L', denField: 'K', category: 'Microplan & Team' },
  { code: 'BN', name: '% Teams with Advance Plan', numField: 'M', denField: 'K', category: 'Microplan & Team' },
  { code: 'BO', name: '% Teams with Correct House Numbering', numField: 'N', denField: 'K', category: 'Microplan & Team' },
  { code: 'BP', name: '% Teams with Both Members Trained', numField: 'P', denField: 'K', category: 'Training' },
  { code: 'BQ', name: '% Teams with 1 Member Trained', numField: 'Q', denField: 'K', category: 'Training' },
  { code: 'BR', name: '% Teams with None Trained', numField: 'R', denField: 'K', category: 'Training' },
  { code: 'BS', name: '% Teams Knowing Target Groups', numField: 'S', denField: 'K', category: 'Knowledge' },
  { code: 'BT', name: '% Teams Knowing Dosages', numField: 'T', denField: 'K', category: 'Knowledge' },
  { code: 'BU', name: '% Teams Knowing Side Effects', numField: 'U', denField: 'K', category: 'Knowledge' },
  { code: 'BV', name: '% Teams Knowing Severe AE Management', numField: 'V', denField: 'K', category: 'Knowledge' },
  { code: 'BW', name: '% Teams Knowing Morbidity Mgmt', numField: 'W', denField: 'K', category: 'Knowledge' },
  { code: 'BX', name: '% Teams Having Sufficient IDA', numField: 'Y', denField: 'X', category: 'Drug Availability' },
  { code: 'BY', name: '% Teams Having Sufficient DEC', numField: 'AA', denField: 'Z', category: 'Drug Availability' },
  { code: 'BZ', name: '% Teams Having Measuring Rod/Tape', numField: 'AC', denField: 'AB', category: 'Logistics' },
  { code: 'CA', name: '% Teams Having Adequate Dose Chart', numField: 'AE', denField: 'AD', category: 'Logistics' },
  { code: 'CB', name: '% Teams Having Tally Sheets', numField: 'AG', denField: 'AF', category: 'Logistics' },
  { code: 'CC', name: '% Teams Having Sufficient Albendazole', numField: 'AI', denField: 'AH', category: 'Drug Availability' },
  { code: 'CD', name: '% Persons Administered Drugs (Observed)', numField: 'AK', denField: 'AJ', category: 'Drug Administration' },
  { code: 'CE', name: '% Persons Swallowed in Presence of DA', numField: 'AM', denField: 'AL', category: 'Drug Administration' },
  { code: 'CF', name: '% Persons Not Swallowed: Sick/Old', numField: 'AN', denField: 'AL', category: 'Refusal' },
  { code: 'CG', name: '% Persons Not Swallowed: Empty Stomach', numField: 'AO', denField: 'AL', category: 'Refusal' },
  { code: 'CH', name: '% Persons Not Swallowed: Fear of AE', numField: 'AP', denField: 'AL', category: 'Refusal' },
  { code: 'CI', name: '% Persons Not Swallowed: No Belief', numField: 'AQ', denField: 'AL', category: 'Refusal' },
  { code: 'CJ', name: '% Persons Not Swallowed: Taken Later', numField: 'AR', denField: 'AL', category: 'Refusal' },
  { code: 'CK', name: '% Persons Refused', numField: 'AS', denField: 'AJ', category: 'Refusal' },
  { code: 'CL', name: '% Teams Marking Houses', numField: 'AU', denField: 'AT', category: 'Documentation' },
  { code: 'CM', name: '% Teams Marking Fingers', numField: 'AW', denField: 'AV', category: 'Documentation' },
  { code: 'CN', name: '% Teams Updating Tally Sheets', numField: 'AY', denField: 'AX', category: 'Documentation' },
  { code: 'CO', name: '% Teams Visited by Supervisor', numField: 'BA', denField: 'K', category: 'Supervision' },
  { code: 'CP', name: '% Teams Supported on Difficulties', numField: 'BC', denField: 'BB', category: 'Supervision' },
  { code: 'CQ', name: '% Teams Corrected on Mistakes', numField: 'BE', denField: 'BD', category: 'Supervision' }
];

// Group by district for dispersion
const districts = [...new Set(records.map(r => r.district))];

// Compute totals
function computeTotals(field) {
  return records.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
}

function computeDistrictPct(districtName, numField, denField) {
  const distRows = records.filter(r => r.district === districtName);
  const num = distRows.reduce((acc, r) => acc + (Number(r[numField]) || 0), 0);
  const den = distRows.reduce((acc, r) => acc + (Number(r[denField]) || 0), 0);
  return den > 0 ? (num * 100) / den : null;
}

// Generate PDF using jsPDF
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
let y = 14;

// Colors
const primaryColor = [20, 108, 80]; // #146C50
const darkColor = [15, 23, 42]; // #0F172A
const slateColor = [100, 116, 139]; // #64748B
const bgHeader = [241, 245, 249]; // #F1F5F9
const borderLine = [226, 232, 240]; // #E2E8F0

function checkPageBreak(neededHeight) {
  if (y + neededHeight > pageHeight - 14) {
    doc.addPage();
    y = 14;
    return true;
  }
  return false;
}

// Title & Header
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(...darkColor);
doc.text('Mass Drug Administration (MDA) Concurrent Monitoring', 14, y);
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.setTextColor(...slateColor);
doc.text('Compiled Percentage Indicators Executive Summary Report', 14, y);

doc.setFontSize(8);
doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, pageWidth - 14, y, { align: 'right' });
y += 8;

// Divider
doc.setDrawColor(...borderLine);
doc.setLineWidth(0.4);
doc.line(14, y, pageWidth - 14, y);
y += 5;

// Metadata Stats Strip
doc.setFillColor(...bgHeader);
doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');

doc.setFontSize(8);
doc.setTextColor(...slateColor);
doc.text('DISTRICTS', 20, y + 4.5);
doc.text('PLANNING UNITS', 65, y + 4.5);
doc.text('TEAMS MONITORED', 115, y + 4.5);
doc.text('OBSERVED CONSUMPTION', 160, y + 4.5);

doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(...darkColor);
doc.text(`${districts.length}`, 20, y + 10.5);
doc.text(`${records.length}`, 65, y + 10.5);
doc.text(`${computeTotals('D').toLocaleString()}`, 115, y + 10.5);

const totalApproached = computeTotals('AJ');
const totalAdministered = computeTotals('AK');
const obsPct = totalApproached > 0 ? ((totalAdministered * 100) / totalApproached).toFixed(1) : 'N/A';
doc.text(`${obsPct}% (${totalAdministered.toLocaleString()}/${totalApproached.toLocaleString()})`, 160, y + 10.5);

y += 19;

// Table Header
function renderTableHeader() {
  doc.setFillColor(...primaryColor);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Code', 16, y + 4.8);
  doc.text('Percentage Indicator Name', 30, y + 4.8);
  doc.text('Category', 95, y + 4.8);
  doc.text('Field Counts (N / D)', 132, y + 4.8);
  doc.text('State %', 165, y + 4.8);
  doc.text('Range (Min - Max)', pageWidth - 16, y + 4.8, { align: 'right' });
  y += 7;
}

renderTableHeader();

let currentCategory = '';

indicators.forEach((ind, index) => {
  const num = computeTotals(ind.numField);
  const den = computeTotals(ind.denField);
  const statePct = den > 0 ? (num * 100) / den : null;

  // District range
  const distVals = districts
    .map(d => computeDistrictPct(d, ind.numField, ind.denField))
    .filter(v => v !== null);

  let rangeStr = 'N/A';
  if (distVals.length > 0) {
    distVals.sort((a, b) => a - b);
    rangeStr = `${distVals[0].toFixed(1)}% - ${distVals[distVals.length - 1].toFixed(1)}%`;
  }

  // Check page break
  if (checkPageBreak(7.5)) {
    renderTableHeader();
  }

  // Row background (alternating subtle)
  if (index % 2 === 1) {
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkColor);
  doc.text(ind.code, 16, y + 4.5);

  doc.setFont('helvetica', 'normal');
  const displayName = ind.name.length > 34 ? ind.name.substring(0, 32) + '...' : ind.name;
  doc.text(displayName, 30, y + 4.5);

  doc.setFontSize(7);
  doc.setTextColor(...slateColor);
  doc.text(ind.category, 95, y + 4.5);

  const countStr = den > 0 ? `${num.toLocaleString()} / ${den.toLocaleString()}` : '-';
  doc.text(countStr, 132, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkColor);
  const pctStr = statePct !== null ? `${statePct.toFixed(1)}%` : 'N/A';
  doc.text(pctStr, 165, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...slateColor);
  doc.text(rangeStr, pageWidth - 16, y + 4.5, { align: 'right' });

  // Border bottom
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.15);
  doc.line(14, y + 6.5, pageWidth - 14, y + 6.5);

  y += 6.5;
});

// Footer
checkPageBreak(12);
y += 4;
doc.setFontSize(7);
doc.setTextColor(...slateColor);
doc.text('MDA Concurrent Monitoring Data • Derived mathematically per National MDA Guidelines from verified field records.', pageWidth / 2, y, { align: 'center' });

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'MDA_Percentage_Indicators_Summary.pdf');
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, pdfBuffer);

console.log(`Static PDF generated successfully at ${outputPath} (${pdfBuffer.length} bytes)`);
