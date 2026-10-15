import React, { useState, useRef } from 'react';
import { Download, Printer, Share2, Check, FileText } from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { DatasetVersion, MonitoringRow } from '../../types/dataset';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { PillarRadarChart } from '../overview/PillarRadarChart';
import { IndicatorDispersionChart } from '../overview/IndicatorDispersionChart';
import { PillarComparativeChart } from '../overview/PillarComparativeChart';
import { generatePdfFromElement } from '../../services/pdfReportGenerator';

interface PdfViewerPageProps {
  dataset: DatasetVersion;
  grandAggregate: GrandAggregate;
  districtAggregates: DistrictAggregate[];
  rows: MonitoringRow[];
}

export const PdfViewerPage: React.FC<PdfViewerPageProps> = ({
  dataset,
  grandAggregate,
  districtAggregates,
  rows
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setIsDownloading(true);
    try {
      const cleanDate = new Date().toISOString().split('T')[0];
      await generatePdfFromElement(documentRef.current, {
        filename: `MDA_Concurrent_Monitoring_Summary_${cleanDate}.pdf`
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    const staticPdfUrl = `${window.location.origin}${window.location.pathname}#/pdf`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(staticPdfUrl);
      } else {
        const input = document.createElement('input');
        input.value = staticPdfUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Could not copy link', e);
    }
  };

  const totalTeams = grandAggregate.rawSums['D'] || 0;
  const totalApproached = grandAggregate.rawSums['AJ'] || 0;
  const totalAdministered = grandAggregate.rawSums['AK'] || 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col selection:bg-mda-100 selection:text-mda-900">
      {/* Fixed Minimalist Top Toolbar - Strictly PDF Actions Only (No Dashboard Access) */}
      <header className="no-print sticky top-0 z-50 h-12 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0 select-none shadow-md">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200 tracking-tight">
            MDA Concurrent Monitoring Summary PDF
          </span>
          <span className="text-[10px] text-slate-500 hidden md:inline font-mono">
            • Read-Only Document
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Link to this exact PDF page */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 shadow-xs"
            title="Copy shareable link to this PDF document"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy PDF Link</span>
              </>
            )}
          </button>

          {/* Print View */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 shadow-xs hidden sm:inline-flex"
            title="Print or Save via browser"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm disabled:opacity-60"
            title="Download PDF to device"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Document Body Canvas */}
      <main className="flex-1 w-full py-6 sm:py-10 px-3 sm:px-6 flex justify-center overflow-x-hidden">
        <div
          ref={documentRef}
          id="executive-report-document"
          className="w-full max-w-5xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 space-y-8"
        >
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    EXECUTIVE SUMMARY PDF
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {dataset.reportingPeriod || 'Concurrent Monitoring Evaluation'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Mass Drug Administration (MDA) Field Monitoring Summary
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Compiled statistical analysis of all percentage indicators calculated across verified field observation records.
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 shrink-0">
                <p className="font-semibold text-slate-800">MDA Concurrent Monitoring System</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Key Executive Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Coverage Territory
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5 metric-number">
                  {grandAggregate.totalDistricts} Districts
                </p>
                <span className="text-xs text-slate-500">
                  {grandAggregate.totalPlanningUnits} Planning Units
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Teams Monitored
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5 metric-number">
                  {totalTeams.toLocaleString()}
                </p>
                <span className="text-xs text-slate-500">
                  DA Field Teams
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Observed In Field
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5 metric-number">
                  {totalApproached.toLocaleString()}
                </p>
                <span className="text-xs text-slate-500">
                  Persons Approached
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Direct Consumption
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5 metric-number">
                  {totalAdministered.toLocaleString()}
                </p>
                <span className="text-xs text-slate-500">
                  Persons Administered
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Dimensional Programmatic Visualizations */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Section 1: Comparative Programmatic Visualizations
              </h2>
              <span className="text-xs text-slate-400">
                Multi-dimensional operational balance
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thematic Spider / Radar Chart */}
              <PillarRadarChart grandAggregate={grandAggregate} />

              {/* Indicator Dispersion / Range Plot */}
              <IndicatorDispersionChart
                districtAggregates={districtAggregates}
                grandAggregate={grandAggregate}
              />
            </div>

            {/* Ranked Horizontal Pillar Bars */}
            <PillarComparativeChart grandAggregate={grandAggregate} />
          </div>

          {/* Section 2: Comprehensive Percentage Indicator Inventory */}
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Section 2: Comprehensive Percentage Indicator Inventory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete mathematical tabulation of all 33 indicators with actual field numerator/denominator counts and district dispersion.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Columns BG through CS (Excel)
              </span>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              {CATEGORIES.map(category => {
                const indicators = INDICATOR_DICTIONARY.filter(ind => ind.category === category);
                if (indicators.length === 0) return null;

                return (
                  <div key={category} className="border border-slate-200 rounded-xl overflow-hidden page-break-inside-avoid">
                    {/* Category Header */}
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <h3 className="text-xs font-bold text-slate-800">
                          {category}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {indicators.length} {indicators.length === 1 ? 'Indicator' : 'Indicators'}
                      </span>
                    </div>

                    {/* Indicator Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
                            <th className="py-2.5 px-3 w-14">Code</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Indicator Name</th>
                            <th className="py-2.5 px-3 text-right">Numerator / Denominator</th>
                            <th className="py-2.5 px-3 text-right w-24">State %</th>
                            <th className="py-2.5 px-3 w-36">Progress</th>
                            <th className="py-2.5 px-3 text-right min-w-[150px]">District Range (Min &bull; Max)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {indicators.map(ind => {
                            const calcVal = grandAggregate.indicatorValues[ind.id];
                            const pct = calcVal?.percentage ?? null;

                            // Compute min & max district values
                            const distVals = districtAggregates
                              .map(d => ({
                                district: d.district,
                                val: d.indicatorValues[ind.id]?.percentage ?? null
                              }))
                              .filter((d): d is { district: string; val: number } => d.val !== null);

                            let minStr = 'N/A';
                            let maxStr = 'N/A';
                            if (distVals.length > 0) {
                              distVals.sort((a, b) => a.val - b.val);
                              const minD = distVals[0];
                              const maxD = distVals[distVals.length - 1];
                              minStr = `${minD.val.toFixed(1)}% (${minD.district})`;
                              maxStr = `${maxD.val.toFixed(1)}% (${maxD.district})`;
                            }

                            return (
                              <tr key={ind.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-500 text-[11px]">
                                  {ind.code}
                                </td>
                                <td className="py-2.5 px-3">
                                  <p className="font-semibold text-slate-800">
                                    {ind.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    {ind.description}
                                  </p>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-600 text-[11px] whitespace-nowrap">
                                  {calcVal && calcVal.denominator > 0 ? (
                                    <span>
                                      {calcVal.numerator.toLocaleString()} / {calcVal.denominator.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right font-bold text-slate-900 metric-number text-xs whitespace-nowrap">
                                  {pct !== null ? `${pct.toFixed(1)}%` : 'N/A'}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-600 rounded-full"
                                      style={{ width: `${Math.min(100, Math.max(0, pct ?? 0))}%` }}
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-right text-[10px] text-slate-500 whitespace-nowrap">
                                  <div>Min: {minStr}</div>
                                  <div>Max: {maxStr}</div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Footer */}
          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>
              MDA Concurrent Monitoring Data &bull; Calculated mathematically per National MDA Guidelines from validated field observations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
