import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  GitBranch,
  Download,
  Eye,
  Settings,
  RefreshCw,
  Layers,
  History
} from 'lucide-react';
import { DatasetVersion, MonitoringRow, ValidationSummary, ColumnMapping } from '../../types/dataset';
import { inspectWorkbookSheets, parseWorksheet, ParseResult } from '../../services/excelParser';
import {
  publishDatasetVersionLocally,
  rollbackToVersion,
  resetToBundledDataset,
  downloadDatasetAsJson,
  getVersionHistory,
  saveGitHubConfig,
  getGitHubConfig,
  commitDatasetToGitHub,
  GitHubConfig
} from '../../services/storageService';
import { CANONICAL_FIELD_ALIASES } from '../../services/columnMapper';
import { Modal } from '../common/Modal';

interface AdminPortalProps {
  currentDataset: DatasetVersion;
  onDatasetUpdated: (newDataset: DatasetVersion) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentDataset,
  onDatasetUpdated
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [workbookInstance, setWorkbookInstance] = useState<any | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<number>(6);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [githubConfigOpen, setGithubConfigOpen] = useState(false);

  // GitHub integration state
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    filePath: 'src/data/activeDataset.json',
    token: ''
  });
  const [isCommittingGithub, setIsCommittingGithub] = useState(false);

  // Version history
  const [versions, setVersions] = useState<DatasetVersion[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVersions(getVersionHistory());
    const savedGh = getGitHubConfig();
    if (savedGh) setGithubConfig(savedGh);
  }, []);

  // Handle File Selection
  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;

    // Check size limit: 20MB
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMsg('File exceeds 20MB maximum upload limit.');
      return;
    }

    setFile(selectedFile);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);

    try {
      const { workbook, sheets } = await inspectWorkbookSheets(selectedFile);
      setWorkbookInstance(workbook);
      setAvailableSheets(sheets.map(s => s.name));
      
      const defaultSheet = sheets[0]?.name || 'Sheet1';
      setSelectedSheet(defaultSheet);

      // Parse with auto-detected header row
      const result = await parseWorksheet(workbook, defaultSheet);
      setParseResult(result);
      setHeaderRow(result.detectedHeaderRow);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read spreadsheet file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Sheet Change
  const handleSheetChange = async (sheetName: string) => {
    if (!workbookInstance) return;
    setSelectedSheet(sheetName);
    setIsProcessing(true);
    try {
      const result = await parseWorksheet(workbookInstance, sheetName);
      setParseResult(result);
      setHeaderRow(result.detectedHeaderRow);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to inspect sheet.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Forced Header Row Change
  const handleHeaderRowChange = async (newRow: number) => {
    if (!workbookInstance || !selectedSheet) return;
    setHeaderRow(newRow);
    setIsProcessing(true);
    try {
      const result = await parseWorksheet(workbookInstance, selectedSheet, newRow);
      setParseResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse sheet with specified header row.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Publish to Active Dashboard (Immediate Local & Browser Update)
  const handlePublishLocally = () => {
    if (!parseResult || !parseResult.validationSummary.isValid) {
      setErrorMsg('Cannot publish invalid dataset. Please resolve errors.');
      return;
    }

    const newVersion: DatasetVersion = {
      id: `mda-dataset-${Date.now()}`,
      sourceFilename: file?.name || 'uploaded_monitoring_data.xlsx',
      uploadedBy: 'Dashboard Administrator',
      uploadedAt: new Date().toISOString(),
      reportingPeriod: `Dataset uploaded from ${file?.name || 'file'} on ${new Date().toLocaleDateString()}`,
      status: 'published',
      rowCount: parseResult.detailRows.length,
      districtCount: new Set(parseResult.detailRows.map(r => r.district)).size,
      planningUnitCount: parseResult.detailRows.length,
      schemaVersion: '1.0.0',
      validationSummary: parseResult.validationSummary,
      records: parseResult.detailRows,
      districtTotals: parseResult.districtTotalRows,
      grandTotal: parseResult.grandTotalRow
    };

    publishDatasetVersionLocally(newVersion);
    onDatasetUpdated(newVersion);
    setVersions(getVersionHistory());
    setSuccessMsg('Dataset successfully published! Active dashboard updated immediately.');
  };

  // Direct Commit to GitHub
  const handleCommitToGitHub = async () => {
    if (!parseResult) return;
    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      setGithubConfigOpen(true);
      return;
    }

    setIsCommittingGithub(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const versionToCommit: DatasetVersion = {
      id: `mda-dataset-${Date.now()}`,
      sourceFilename: file?.name || 'uploaded_monitoring_data.xlsx',
      uploadedBy: 'Dashboard Administrator',
      uploadedAt: new Date().toISOString(),
      reportingPeriod: `Dataset uploaded from ${file?.name || 'file'} on ${new Date().toLocaleDateString()}`,
      status: 'published',
      rowCount: parseResult.detailRows.length,
      districtCount: new Set(parseResult.detailRows.map(r => r.district)).size,
      planningUnitCount: parseResult.detailRows.length,
      schemaVersion: '1.0.0',
      validationSummary: parseResult.validationSummary,
      records: parseResult.detailRows,
      districtTotals: parseResult.districtTotalRows,
      grandTotal: parseResult.grandTotalRow
    };

    try {
      saveGitHubConfig(githubConfig);
      const res = await commitDatasetToGitHub(
        githubConfig,
        versionToCommit,
        `Update active dataset: ${versionToCommit.reportingPeriod}`
      );

      // Also publish locally
      publishDatasetVersionLocally(versionToCommit);
      onDatasetUpdated(versionToCommit);
      setVersions(getVersionHistory());

      setSuccessMsg(
        'Successfully pushed activeDataset.json directly to GitHub repository! ' +
        (res.commitUrl ? `Commit created: ${res.commitUrl}` : 'Production deployment will build automatically.')
      );
    } catch (err: any) {
      setErrorMsg(`GitHub Commit Error: ${err.message}`);
    } finally {
      setIsCommittingGithub(false);
    }
  };

  // Rollback
  const handleRollback = (versionId: string) => {
    try {
      const rolledBack = rollbackToVersion(versionId);
      onDatasetUpdated(rolledBack);
      setVersions(getVersionHistory());
      setSuccessMsg(`Successfully rolled back to version ${versionId}.`);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Reset to Baseline
  const handleResetBaseline = () => {
    const base = resetToBundledDataset();
    onDatasetUpdated(base);
    setVersions(getVersionHistory());
    setSuccessMsg('Active dataset restored to bundled baseline.');
  };

  // Download activeDataset.json
  const handleDownloadActiveJson = () => {
    if (parseResult) {
      const versionToDownload: DatasetVersion = {
        id: `mda-dataset-${Date.now()}`,
        sourceFilename: file?.name || 'uploaded_monitoring_data.xlsx',
        uploadedBy: 'Dashboard Administrator',
        uploadedAt: new Date().toISOString(),
        reportingPeriod: `Dataset uploaded from ${file?.name || 'file'} on ${new Date().toLocaleDateString()}`,
        status: 'published',
        rowCount: parseResult.detailRows.length,
        districtCount: new Set(parseResult.detailRows.map(r => r.district)).size,
        planningUnitCount: parseResult.detailRows.length,
        schemaVersion: '1.0.0',
        validationSummary: parseResult.validationSummary,
        records: parseResult.detailRows,
        districtTotals: parseResult.districtTotalRows,
        grandTotal: parseResult.grandTotalRow
      };
      downloadDatasetAsJson(versionToDownload);
    } else {
      downloadDatasetAsJson(currentDataset);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="card-subtle rounded-2xl p-6 bg-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mda-50 text-mda-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Dataset Administration & Publishing Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload updated Excel (.xlsx, .xls) or CSV files. The platform auto-detects header rows, normalizes column names, excludes double-counted subtotals, and updates the codebase dataset.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGithubConfigOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all border border-slate-200 shadow-xs"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub Sync Settings</span>
          </button>

          <button
            onClick={handleDownloadActiveJson}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 bg-surface-subtle hover:bg-slate-100 text-slate-800 font-bold rounded-xl transition-all border border-slate-200 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Upload or Validation Error</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Action Completed</p>
            <p className="mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div className="card-subtle rounded-2xl p-8 bg-white border-2 border-dashed border-slate-200 hover:border-mda-500 transition-colors text-center shadow-card">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={e => e.target.files && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-mda-50 text-mda-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800">
            {file ? file.name : 'Upload New Monitoring Dataset'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Drag and drop your Excel (.xlsx, .xls) or CSV file here, or click to browse. Max upload size: 20MB.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-mda-700 hover:bg-mda-800 text-white transition-all shadow-sm disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? 'Analyzing Workbook...' : 'Select File'}
            </button>
            {file && (
              <span className="text-xs font-mono text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analysis & Validation Summary (When file is analyzed) */}
      {parseResult && (
        <div className="card-subtle rounded-2xl p-6 bg-white shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Dataset Inspection & Column Mapping
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Worksheet: <strong>{selectedSheet}</strong> • Header detected at row: <strong>{headerRow}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Sheet Switcher */}
              {availableSheets.length > 1 && (
                <select
                  value={selectedSheet}
                  onChange={e => handleSheetChange(e.target.value)}
                  className="text-xs bg-surface-subtle border border-surface-border rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                >
                  {availableSheets.map(s => (
                    <option key={s} value={s}>
                      Sheet: {s}
                    </option>
                  ))}
                </select>
              )}

              {/* Header Row Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-surface-subtle px-2.5 py-1.5 rounded-lg border border-surface-border">
                <span>Header Row:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={headerRow}
                  onChange={e => handleHeaderRowChange(Number(e.target.value))}
                  className="w-12 text-center bg-white border border-slate-200 rounded py-0.5 font-mono text-xs font-bold text-slate-900"
                />
              </div>

              <button
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Raw Data Preview</span>
              </button>
            </div>
          </div>

          {/* Validation Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Planning Units</span>
              <p className="text-lg font-bold text-slate-900 metric-number">
                {parseResult.detailRows.length}
              </p>
              <p className="text-[11px] text-emerald-600">Detail records verified</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Districts</span>
              <p className="text-lg font-bold text-slate-900 metric-number">
                {new Set(parseResult.detailRows.map(r => r.district)).size}
              </p>
              <p className="text-[11px] text-slate-500">Unique districts</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Subtotals Excluded</span>
              <p className="text-lg font-bold text-slate-900 metric-number">
                {parseResult.validationSummary.districtTotalsExcludedCount}
              </p>
              <p className="text-[11px] text-amber-600">Double-counting prevented</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Validation Status</span>
              <p className={`text-base font-bold ${parseResult.validationSummary.isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {parseResult.validationSummary.isValid ? 'Passed Validation' : 'Errors Found'}
              </p>
              <p className="text-[11px] text-slate-500">
                {parseResult.validationSummary.errors.length} errors, {parseResult.validationSummary.warnings.length} notices
              </p>
            </div>
          </div>

          {/* Validation Warnings / Notices */}
          {parseResult.validationSummary.warnings.length > 0 && (
            <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Data Integrity Safeguards Applied:
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                {parseResult.validationSummary.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Column Mapping Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Column Name Normalization & Aliases Mapping ({parseResult.mappings.length} columns)
              </h4>
              <span className="text-[11px] text-slate-400">
                Rearranged column order supported
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto border border-surface-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 sticky top-0 border-b border-surface-border text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Source Header in File</th>
                    <th className="py-2 px-3">Canonical Indicator / Metric</th>
                    <th className="py-2 px-3 text-center">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-700">
                  {parseResult.mappings.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-medium text-slate-800">
                        {m.sourceColumn}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-[11px]">
                        <span className="font-semibold text-mda-800">
                          {m.canonicalField}
                        </span>
                        {CANONICAL_FIELD_ALIASES[m.canonicalField] && (
                          <span className="ml-2 text-slate-500 font-sans">
                            ({CANONICAL_FIELD_ALIASES[m.canonicalField].label})
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            m.confidence === 'exact'
                              ? 'bg-emerald-50 text-emerald-700'
                              : m.confidence === 'high'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Publishing Actions */}
          <div className="pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {parseResult.validationSummary.isValid
                ? 'Ready to publish. This replaces the active dataset atomically.'
                : 'Please fix validation errors before publishing.'}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Option A: Publish Locally */}
              <button
                onClick={handlePublishLocally}
                disabled={!parseResult.validationSummary.isValid}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-mda-700 hover:bg-mda-800 text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish to Dashboard</span>
              </button>

              {/* Option B: Direct GitHub Commit */}
              <button
                onClick={handleCommitToGitHub}
                disabled={!parseResult.validationSummary.isValid || isCommittingGithub}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-black text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                title="Commit directly to GitHub repo to trigger automatic production deployment"
              >
                <GitBranch className="w-4 h-4" />
                <span>{isCommittingGithub ? 'Committing to GitHub...' : 'Commit to GitHub'}</span>
              </button>

              {/* Option C: Download JSON */}
              <button
                onClick={handleDownloadActiveJson}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download activeDataset.json</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Version History & Rollback */}
      <div className="card-subtle rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-mda-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Dataset Version History & Rollback Safeguards
            </h3>
          </div>
          <button
            onClick={handleResetBaseline}
            className="text-xs text-rose-700 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        <div className="space-y-3">
          {versions.map((ver, idx) => {
            const isCurrent = ver.id === currentDataset.id;
            const dateStr = new Date(ver.uploadedAt).toLocaleString();

            return (
              <div
                key={ver.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  isCurrent
                    ? 'border-mda-400 bg-mda-50/20'
                    : 'border-surface-border hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{ver.sourceFilename}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {ver.districtCount} Districts • {ver.planningUnitCount} Planning Units • {dateStr} • By {ver.uploadedBy}
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleRollback(ver.id)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Rollback to this
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Data Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Parsed Raw Data Preview (First 10 Rows)"
        subtitle="Verifies that headers and detail rows were interpreted accurately"
        maxWidth="4xl"
      >
        {parseResult && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-600 border-b">
                <tr>
                  {Object.keys(parseResult.rawJsonPreview[0] || {}).map(k => (
                    <th key={k} className="py-2 px-3 whitespace-nowrap">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {parseResult.rawJsonPreview.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="py-1.5 px-3 whitespace-nowrap">
                        {String(v ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* GitHub Configuration Modal */}
      <Modal
        isOpen={githubConfigOpen}
        onClose={() => setGithubConfigOpen(false)}
        title="Direct GitHub Integration Settings"
        subtitle="Enables one-click publishing directly into your GitHub repository to trigger automatic production builds"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              GitHub Repository Owner / Org
            </label>
            <input
              type="text"
              placeholder="e.g. pratt or your-org"
              value={githubConfig.owner}
              onChange={e => setGithubConfig(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Repository Name
            </label>
            <input
              type="text"
              placeholder="e.g. mdamonitor"
              value={githubConfig.repo}
              onChange={e => setGithubConfig(prev => ({ ...prev, repo: e.target.value }))}
              className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Branch Name
            </label>
            <input
              type="text"
              placeholder="main"
              value={githubConfig.branch}
              onChange={e => setGithubConfig(prev => ({ ...prev, branch: e.target.value }))}
              className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target JSON Path in Repository
            </label>
            <input
              type="text"
              placeholder="src/data/activeDataset.json"
              value={githubConfig.filePath}
              onChange={e => setGithubConfig(prev => ({ ...prev, filePath: e.target.value }))}
              className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              GitHub Personal Access Token (PAT)
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubConfig.token}
              onChange={e => setGithubConfig(prev => ({ ...prev, token: e.target.value }))}
              className="w-full p-2 bg-surface-subtle border border-surface-border rounded-lg text-slate-800 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Token needs <code>repo</code> or <code>contents:write</code> scope. Stored only in your local browser storage.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => setGithubConfigOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                saveGitHubConfig(githubConfig);
                setGithubConfigOpen(false);
                setSuccessMsg('GitHub settings saved.');
              }}
              className="px-3 py-1.5 rounded-lg bg-mda-700 hover:bg-mda-800 text-white font-semibold"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
