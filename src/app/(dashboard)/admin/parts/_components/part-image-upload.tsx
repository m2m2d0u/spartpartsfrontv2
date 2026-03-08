"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UploadIcon } from "@/assets/icons";
import type { PartImage } from "@/types";

type Props = {
  partId: string;
  initialImages: PartImage[];
};

export function PartImageUpload({ partId, initialImages }: Props) {
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");

  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<PartImage[]>(initialImages);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingMainId, setSettingMainId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  function validateFiles(files: File[]): File[] {
    const valid: File[] = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(t("imageInvalidType"));
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(t("imageFileTooLarge"));
        continue;
      }
      valid.push(file);
    }
    return valid;
  }

  function addFiles(files: File[]) {
    const valid = validateFiles(files);
    if (valid.length === 0) return;
    setError("");
    setPendingFiles((prev) => [...prev, ...valid]);

    // Generate previews
    valid.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = "";
  }

  function removePending(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const { uploadPartImages } = await import("@/services/parts.service");
      const uploaded = await uploadPartImages(partId, pendingFiles);
      setImages((prev) => [...prev, ...uploaded]);
      // Clean up previews
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPendingFiles([]);
      setPreviews([]);
    } catch {
      setError(t("imageUploadFailed"));
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    setDeletingId(imageId);
    setError("");

    try {
      const { removePartImage } = await import("@/services/parts.service");
      await removePartImage(partId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      setError(t("imageDeleteFailed"));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetMain(imageId: string) {
    setSettingMainId(imageId);
    setError("");

    try {
      const { setMainImage } = await import("@/services/parts.service");
      await setMainImage(partId, imageId);
      setImages((prev) =>
        prev.map((img) => ({ ...img, isMain: img.id === imageId })),
      );
    } catch {
      setError(t("imageSetMainFailed"));
    } finally {
      setSettingMainId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-body-sm font-medium text-dark dark:text-white">
        {t("images")}
      </h4>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${img.isMain ? "border-primary" : "border-stroke dark:border-dark-3"}`}>
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
              {/* Main badge */}
              {img.isMain && (
                <div className="absolute left-1.5 top-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-body-xs font-medium text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                    </svg>
                    {t("mainImage")}
                  </span>
                </div>
              )}
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(img.id)}
                    disabled={settingMainId === img.id}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-dark hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {settingMainId === img.id ? (
                      <svg
                        className="size-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      t("setAsMain")
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  disabled={deletingId === img.id}
                  className="rounded-lg bg-red px-3 py-1.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {deletingId === img.id ? (
                    <svg
                      className="size-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    tCommon("delete")
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending files preview */}
      {previews.length > 0 && (
        <div>
          <p className="mb-2 text-body-xs font-medium text-dark-6">
            {t("pendingUpload", { count: pendingFiles.length })}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((url, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-primary/40">
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => removePending(idx)}
                    className="rounded-lg bg-dark/70 px-3 py-1.5 text-sm font-medium text-white hover:bg-dark/90"
                  >
                    {tCommon("remove")}
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="truncate rounded bg-black/50 px-1.5 py-0.5 text-body-xs text-white">
                    {pendingFiles[idx]?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
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
              {uploading
                ? t("imageUploading")
                : t("imageUploadBtn", { count: pendingFiles.length })}
            </button>
            <button
              type="button"
              onClick={() => {
                previews.forEach((url) => URL.revokeObjectURL(url));
                setPendingFiles([]);
                setPreviews([]);
              }}
              disabled={uploading}
              className="rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              {tCommon("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
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
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleInputChange}
          hidden
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center p-6"
        >
          <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
            <UploadIcon />
          </div>
          <p className="mt-3 text-body-sm font-medium">
            <span className="text-primary">{t("imageClickUpload")}</span>{" "}
            {t("imageOrDrag")}
          </p>
          <p className="mt-1.5 text-body-xs text-dark-6">
            {t("imageFileTypes")}
          </p>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
          {error}
        </div>
      )}
    </div>
  );
}
