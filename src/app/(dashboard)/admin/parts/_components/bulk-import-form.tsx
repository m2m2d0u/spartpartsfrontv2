"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormSection } from "@/components/FormSection";
import { UploadIcon } from "@/assets/icons";
import type { BulkImportResult } from "@/services/parts.service";

export function BulkImportForm() {
  const router = useRouter();
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState("");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) selectFile(dropped);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) selectFile(selected);
    e.target.value = "";
  }

  function selectFile(f: File) {
    setFile(f);
    setResult(null);
    setError("");
  }

  function handleRemoveFile() {
    setFile(null);
    setResult(null);
    setError("");
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);

    try {
      const { bulkImportParts } = await import("@/services/parts.service");
      const res = await bulkImportParts(file);
      setResult(res);
      if (res.errorCount === 0) {
        setFile(null);
      }
    } catch {
      setError(t("bulkImportFailed"));
    } finally {
      setUploading(false);
    }
  }

  const fileExtension = file?.name.split(".").pop()?.toLowerCase();
  const isValidType = fileExtension === "xlsx" || fileExtension === "xls" || fileExtension === "csv";

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <FormSection title={t("bulkImportTitle")} description={t("bulkImportDesc")}>
        {file ? (
          <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-primary"
                >
                  <path
                    d="M11.667 1.667H5a1.667 1.667 0 00-1.667 1.666v13.334A1.667 1.667 0 005 18.333h10a1.667 1.667 0 001.667-1.666V6.667l-5-5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.667 1.667v5h5M13.333 10.833H6.667M13.333 14.167H6.667M8.333 7.5H6.667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">
                  {file.name}
                </p>
                <p className="text-body-xs text-dark-6">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={uploading}
              className="rounded-lg border border-stroke px-3 py-1.5 text-sm text-dark-5 hover:border-red hover:text-red disabled:opacity-50 dark:border-dark-3 dark:text-dark-6"
            >
              {tCommon("remove")}
            </button>
          </div>
        ) : (
          <div
            className={`relative rounded-xl border border-dashed ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleInputChange}
              hidden
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center p-6 sm:py-10"
            >
              <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                <UploadIcon />
              </div>
              <p className="mt-3 text-body-sm font-medium">
                <span className="text-primary">{t("bulkImportClickUpload")}</span>{" "}
                {t("bulkImportOrDrag")}
              </p>
              <p className="mt-1.5 text-body-xs text-dark-6">
                {t("bulkImportFileTypes")}
              </p>
            </button>
          </div>
        )}

        {/* Upload button */}
        {file && !result && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !isValidType}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {uploading && (
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
              )}
              {uploading ? t("bulkImportUploading") : t("bulkImportStart")}
            </button>
            {!isValidType && (
              <p className="text-body-xs text-red">{t("bulkImportInvalidType")}</p>
            )}
          </div>
        )}
      </FormSection>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red/5 p-4 text-sm text-red">{error}</div>
      )}

      {/* Results */}
      {result && (
        <FormSection title={t("bulkImportResults")}>
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
              <p className="text-body-xs text-dark-6">{t("bulkImportTotalRows")}</p>
              <p className="mt-1 text-xl font-semibold text-dark dark:text-white">
                {result.totalRows}
              </p>
            </div>
            <div className="rounded-lg border border-green-light-1 bg-green-light-1/5 p-4">
              <p className="text-body-xs text-dark-6">{t("bulkImportSuccess")}</p>
              <p className="mt-1 text-xl font-semibold text-[#027A48]">
                {result.successCount}
              </p>
            </div>
            {result.errorCount > 0 && (
              <div className="rounded-lg border border-red bg-red/5 p-4">
                <p className="text-body-xs text-dark-6">{t("bulkImportErrors")}</p>
                <p className="mt-1 text-xl font-semibold text-red">
                  {result.errorCount}
                </p>
              </div>
            )}
          </div>

          {/* Error details */}
          {result.errors.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-4 py-3 font-medium text-dark dark:text-white">
                      {t("bulkImportRow")}
                    </th>
                    <th className="px-4 py-3 font-medium text-dark dark:text-white">
                      {t("bulkImportField")}
                    </th>
                    <th className="px-4 py-3 font-medium text-dark dark:text-white">
                      {t("bulkImportMessage")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-4 py-3 font-medium text-dark dark:text-white">
                        {err.row}
                      </td>
                      <td className="px-4 py-3 text-dark-6">{err.field}</td>
                      <td className="px-4 py-3 text-red">{err.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Actions after import */}
          <div className="mt-4 flex gap-3">
            {result.successCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  router.push("/admin/parts");
                  router.refresh();
                }}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {t("bulkImportViewParts")}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setResult(null);
                setError("");
              }}
              className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              {t("bulkImportUploadAnother")}
            </button>
          </div>
        </FormSection>
      )}
    </div>
  );
}
