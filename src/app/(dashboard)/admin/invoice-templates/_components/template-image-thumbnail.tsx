"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";

type Props = {
  templateId: string;
  label: string;
  hasImage: boolean;
  imageType:
    | "logo"
    | "stamp"
    | "header-image"
    | "footer-image"
    | "signature"
    | "watermark";
};

export function TemplateImageThumbnail({
  templateId,
  label,
  hasImage,
  imageType,
}: Props) {
  const t = useTranslations("invoiceTemplates");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    // If we already have the image cached, just open the dialog
    if (imageSrc) {
      setPreviewOpen(true);
      return;
    }

    setLoading(true);
    try {
      const { getTemplateImage } = await import(
        "@/services/invoice-templates.service"
      );
      const result = await getTemplateImage(templateId, imageType);
      if (result?.base64) {
        const src = `data:image/png;base64,${result.base64}`;
        setImageSrc(src);
        setPreviewOpen(true);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-body-sm text-dark-6">{label}</p>
      {hasImage ? (
        <>
          <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="mt-1 inline-flex items-center gap-2 rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:opacity-50 dark:border-dark-3 dark:hover:bg-primary/10"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                {t("loadingImage")}
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {t("clickToView")}
              </>
            )}
          </button>

          {imageSrc && (
            <ImagePreviewDialog
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              src={imageSrc}
              alt={label}
            />
          )}
        </>
      ) : (
        <p className="mt-1 text-dark-6">—</p>
      )}
    </div>
  );
}
