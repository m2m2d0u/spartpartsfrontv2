"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CreateInvoiceTemplateRequest } from "@/types";
import { PdfViewerDialog } from "@/components/ui/pdf-viewer-dialog";

type Props = {
  design: string;
  templateData: CreateInvoiceTemplateRequest;
  logo?: File | null;
  stamp?: File | null;
  className?: string;
};

export function TemplatePreviewButton({
  design,
  templateData,
  logo,
  stamp,
  className = "inline-flex items-center gap-1.5 rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2",
}: Props) {
  const [previewing, setPreviewing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const t = useTranslations("invoiceTemplates");

  async function handlePreview() {
    setPreviewing(true);
    setError("");
    try {
      const { previewDesign } = await import(
        "@/services/invoice-templates.service"
      );
      const blobUrl = await previewDesign(
        design,
        templateData,
        logo,
        stamp,
      );
      setPreviewBlobUrl(blobUrl);
      setPreviewOpen(true);
    } catch {
      setError(t("previewFailed"));
    } finally {
      setPreviewing(false);
    }
  }

  function handleClosePreview() {
    setPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePreview}
        disabled={previewing}
        className={className}
      >
        {previewing ? (
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
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
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
        {t("previewDesign")}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red">{error}</p>
      )}

      <PdfViewerDialog
        open={previewOpen}
        onClose={handleClosePreview}
        blobUrl={previewBlobUrl}
        title={t("previewDesignTitle", {
          design: t(`design_${design}`),
        })}
      />
    </>
  );
}
