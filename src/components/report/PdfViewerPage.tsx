import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Check, ArrowLeft, Printer, RefreshCw, FileText } from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { DatasetVersion, MonitoringRow } from '../../types/dataset';
import { ExecutiveReportView } from './ExecutiveReportView';
import { createPdfBlobFromElement } from '../../services/pdfReportGenerator';

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
  const hiddenReportRef = useRef<HTMLDivElement>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    let isMounted = true;
    let createdUrl: string | null = null;

    const generate = async () => {
      // Allow DOM to settle for Recharts/SVG render
      await new Promise(r => setTimeout(r, 400));
      if (!hiddenReportRef.current || !isMounted) return;

      try {
        const reportElement = hiddenReportRef.current.querySelector('#executive-report-document') as HTMLElement;
        const targetElement = reportElement || hiddenReportRef.current;

        const blob = await createPdfBlobFromElement(targetElement, {
          onProgress: p => {
            if (isMounted) setProgress(p);
          }
        });

        if (isMounted) {
          createdUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(createdUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to create PDF blob:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generate();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [dataset.id]);

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = `MDA_Monitoring_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = async () => {
    const staticPdfUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}/MDA_Percentage_Indicators_Summary.pdf`;
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col h-screen w-screen overflow-hidden">
      {/* Minimalist Top Utility Header - Strictly PDF controls only */}
      <header className="h-11 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-white shrink-0 select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate">
            Mass Drug Administration (MDA) Concurrent Monitoring Summary PDF
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Static Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Copy static link to this PDF"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Copy PDF Link</span>
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfBlobUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs disabled:opacity-50"
            title="Save PDF file to computer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main PDF Viewport (Just the PDF) */}
      <main className="flex-1 w-full bg-slate-800 relative flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
            <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
            <p className="text-sm font-medium tracking-tight">
              Compiling percentage indicators PDF... {progress}%
            </p>
            <p className="text-xs text-slate-500">
              Generating vector charts and complete 33-indicator inventory
            </p>
          </div>
        ) : pdfBlobUrl ? (
          <iframe
            src={pdfBlobUrl}
            className="w-full h-full border-0 bg-slate-100"
            title="MDA Concurrent Monitoring Percentage Indicators Summary PDF"
          />
        ) : (
          <div className="text-center p-6 text-slate-400">
            <p className="text-sm font-semibold text-white mb-2">Unable to render PDF inline</p>
            <p className="text-xs mb-4">Your browser may block inline PDF display.</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold"
            >
              Download PDF Directly
            </button>
          </div>
        )}
      </main>

      {/* Off-screen Document Element used to generate pixel-perfect PDF canvas */}
      <div
        ref={hiddenReportRef}
        aria-hidden="true"
        className="fixed -left-[9999px] top-0 w-[1024px] pointer-events-none opacity-0"
      >
        <ExecutiveReportView
          dataset={dataset}
          grandAggregate={grandAggregate}
          districtAggregates={districtAggregates}
          rows={rows}
        />
      </div>
    </div>
  );
};
