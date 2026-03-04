"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use CDN worker matching the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_DEFAULT = 1.5;

type PdfViewerDialogProps = {
  open: boolean;
  onClose: () => void;
  blobUrl: string | null;
  title?: string;
  onDownload?: () => void;
  downloading?: boolean;
};

export function PdfViewerDialog({
  open,
  onClose,
  blobUrl,
  title,
  onDownload,
  downloading = false,
}: PdfViewerDialogProps) {
  const t = useTranslations("invoices");
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(ZOOM_DEFAULT);

  const handleClose = useCallback(() => {
    onClose();
    // Reset state on close
    setNumPages(0);
    setCurrentPage(1);
    setScale(ZOOM_DEFAULT);
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function onDocumentLoadSuccess({ numPages: total }: { numPages: number }) {
    setNumPages(total);
    setCurrentPage(1);
  }

  function goToPrevPage() {
    setCurrentPage((p) => Math.max(1, p - 1));
  }

  function goToNextPage() {
    setCurrentPage((p) => Math.min(numPages, p + 1));
  }

  function zoomIn() {
    setScale((s) => Math.min(ZOOM_MAX, +(s + ZOOM_STEP).toFixed(2)));
  }

  function zoomOut() {
    setScale((s) => Math.max(ZOOM_MIN, +(s - ZOOM_STEP).toFixed(2)));
  }

  function resetZoom() {
    setScale(ZOOM_DEFAULT);
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/80">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-stroke bg-white px-4 py-3 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          {/* PDF icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-primary"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h3 className="text-sm font-semibold text-dark dark:text-white sm:text-base">
            {title || "PDF"}
          </h3>
        </div>

        {/* Center: page navigation + zoom */}
        {numPages > 0 && (
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                className="rounded p-1.5 text-dark transition hover:bg-gray-2 disabled:opacity-30 dark:text-white dark:hover:bg-dark-2"
                aria-label={t("prevPage")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="min-w-[60px] text-center text-xs font-medium text-dark dark:text-white sm:text-sm">
                {currentPage} / {numPages}
              </span>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
                className="rounded p-1.5 text-dark transition hover:bg-gray-2 disabled:opacity-30 dark:text-white dark:hover:bg-dark-2"
                aria-label={t("nextPage")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-1 hidden h-5 w-px bg-stroke dark:bg-dark-3 sm:block" />

            {/* Zoom controls */}
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={zoomOut}
                disabled={scale <= ZOOM_MIN}
                className="rounded p-1.5 text-dark transition hover:bg-gray-2 disabled:opacity-30 dark:text-white dark:hover:bg-dark-2"
                aria-label={t("zoomOut")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="min-w-[48px] rounded px-1.5 py-1 text-xs font-medium text-dark transition hover:bg-gray-2 dark:text-white dark:hover:bg-dark-2"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={scale >= ZOOM_MAX}
                className="rounded p-1.5 text-dark transition hover:bg-gray-2 disabled:opacity-30 dark:text-white dark:hover:bg-dark-2"
                aria-label={t("zoomIn")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Right: download + close */}
        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 sm:px-4 sm:text-sm"
            >
              <svg
                width="16"
                height="16"
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
              <span className="hidden sm:inline">
                {downloading ? t("downloading") : t("downloadPdf")}
              </span>
            </button>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-dark transition hover:border-red hover:text-red dark:border-dark-3 dark:text-white dark:hover:border-red dark:hover:text-red"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="ml-1.5 hidden sm:inline">
              {t("closePdfViewer")}
            </span>
          </button>
        </div>
      </div>

      {/* PDF content area */}
      <div className="flex flex-1 items-start justify-center overflow-auto py-6">
        {blobUrl ? (
          <Document
            file={blobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-3 pt-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-white/70">{t("loadingPdf")}</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center gap-3 pt-20">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-sm text-white/70">{t("pdfLoadError")}</p>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              loading={
                <div className="flex items-center justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }
              className="shadow-lg"
            />
          </Document>
        ) : (
          <div className="flex flex-col items-center gap-3 pt-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-white/70">{t("loadingPdf")}</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
