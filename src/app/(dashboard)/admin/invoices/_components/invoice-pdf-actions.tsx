"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PdfViewerDialog } from "@/components/ui/pdf-viewer-dialog";

type Props = {
  invoiceId: string;
  invoiceNumber: string;
};

export function InvoicePdfActions({ invoiceId, invoiceNumber }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const t = useTranslations("invoices");

  async function handlePreview() {
    setPreviewing(true);
    try {
      const { getInvoicePdfBlobUrl } = await import(
        "@/services/invoices.service"
      );
      const url = await getInvoicePdfBlobUrl(invoiceId);
      setPdfUrl(url);
      setViewerOpen(true);
    } catch {
      // silent — user can retry
    } finally {
      setPreviewing(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const { downloadInvoicePdf } = await import(
        "@/services/invoices.service"
      );
      const filename = `${invoiceNumber.replace(/\//g, "-")}.pdf`;
      await downloadInvoicePdf(invoiceId, filename);
    } catch {
      // silent — user can retry
    } finally {
      setDownloading(false);
    }
  }

  function handleCloseViewer() {
    setViewerOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewing}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark transition hover:border-primary hover:text-primary disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:border-primary dark:hover:text-primary"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {previewing ? t("previewing") : t("preview")}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloading ? t("downloading") : t("downloadPdf")}
        </button>
      </div>

      <PdfViewerDialog
        open={viewerOpen}
        onClose={handleCloseViewer}
        blobUrl={pdfUrl}
        title={invoiceNumber}
        onDownload={handleDownload}
        downloading={downloading}
      />
    </>
  );
}
