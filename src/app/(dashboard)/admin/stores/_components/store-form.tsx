"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import { UploadIcon } from "@/assets/icons";
import type { Store } from "@/types";

type Props = {
  store?: Store;
};

/** Reusable drag-and-drop file upload zone */
function ImageUploadZone({
  label,
  previewUrl,
  onFileChange,
  onRemove,
  accept = "image/png, image/jpg, image/jpeg",
  hint,
}: {
  label: string;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChange(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      {previewUrl ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={label}
            className="h-32 max-w-[200px] rounded-lg border border-stroke object-contain dark:border-dark-3"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red text-white text-xs hover:bg-red/80"
          >
            &times;
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
            accept={accept}
            onChange={handleInputChange}
            hidden
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
          >
            <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
              <UploadIcon />
            </div>
            <p className="mt-2.5 text-body-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and
              drop
            </p>
            {hint && <p className="mt-1 text-body-xs">{hint}</p>}
          </button>
        </div>
      )}
    </div>
  );
}

export function StoreForm({ store }: Props) {
  const router = useRouter();
  const isEditing = !!store;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("stores");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  // File state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [stampPreview, setStampPreview] = useState<string | null>(null);
  // Track if existing images should be removed (by uploading empty)
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [stampRemoved, setStampRemoved] = useState(false);

  // Load existing images as base64 previews when editing
  useEffect(() => {
    if (!store) return;
    let cancelled = false;
    const storeId = store.id;
    const hasLogo = !!store.logoUrl;
    const hasStamp = !!store.stampImageUrl;

    async function loadPreviews() {
      const { getStoreLogo, getStoreStamp } = await import(
        "@/services/stores.service"
      );
      const [logo, stamp] = await Promise.all([
        hasLogo ? getStoreLogo(storeId).catch(() => null) : null,
        hasStamp ? getStoreStamp(storeId).catch(() => null) : null,
      ]);
      if (cancelled) return;
      if (logo?.base64) setLogoPreview(`data:image/png;base64,${logo.base64}`);
      if (stamp?.base64)
        setStampPreview(`data:image/png;base64,${stamp.base64}`);
    }

    loadPreviews();
    return () => {
      cancelled = true;
    };
  }, [store]);
  const storeSchema = Yup.object({
    name: Yup.string().trim().required(tVal("storeNameRequired")),
    code: Yup.string().trim().required(tVal("storeCodeRequired")),
    phone: Yup.string(),
    email: Yup.string().email(tVal("validEmail")),
    isActive: Yup.boolean(),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: store?.name || "",
      code: store?.code || "",
      phone: store?.phone || "",
      email: store?.email || "",
      isActive: store?.isActive ?? true,
      street: store?.street || "",
      city: store?.city || "",
      state: store?.state || "",
      postalCode: store?.postalCode || "",
      country: store?.country || "Sénégal",
    },
    validationSchema: storeSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        if (isEditing) {
          // Preserve existing image URLs unless explicitly removed
          const payload = {
            ...values,
            logoUrl: logoRemoved ? undefined : (store.logoUrl ?? undefined),
            stampImageUrl: stampRemoved
              ? undefined
              : (store.stampImageUrl ?? undefined),
          };

          if (logoFile || stampFile) {
            const { updateStoreWithFiles } = await import(
              "@/services/stores.service"
            );
            await updateStoreWithFiles(store.id, payload, logoFile, stampFile);
          } else {
            const { updateStore } = await import("@/services/stores.service");
            await updateStore(store.id, payload);
          }
          router.push(`/admin/stores/${store.id}`);
        } else {
          if (logoFile || stampFile) {
            const { createStoreWithFiles } = await import(
              "@/services/stores.service"
            );
            const created = await createStoreWithFiles(
              values,
              logoFile,
              stampFile,
            );
            router.push(`/admin/stores/${created.id}`);
          } else {
            const { createStore } = await import("@/services/stores.service");
            const created = await createStore(values);
            router.push(`/admin/stores/${created.id}`);
          }
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  function handleLogoChange(file: File) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoRemoved(false);
  }

  function handleStampChange(file: File) {
    setStampFile(file);
    setStampPreview(URL.createObjectURL(file));
    setStampRemoved(false);
  }

  function handleLogoRemove() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoRemoved(true);
  }

  function handleStampRemove() {
    setStampFile(null);
    setStampPreview(null);
    setStampRemoved(true);
  }

  return (
    <FormSection title={isEditing ? t("editStore") : t("newStore")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("storeName")}
            name="name"
            type="text"
            placeholder={t("storeNamePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
          <InputGroup
            label={t("storeCode")}
            name="code"
            type="text"
            placeholder={t("storeCodePlaceholder")}
            value={formik.values.code}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("code")}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={tCommon("phone")}
            name="phone"
            type="text"
            placeholder={tCommon("phonePlaceholder")}
            value={formik.values.phone}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label={tCommon("email")}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("email")}
          />
        </div>

        {/* Logo & Stamp uploads */}
        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {t("branding")}
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ImageUploadZone
              label={t("logo")}
              previewUrl={logoPreview}
              onFileChange={handleLogoChange}
              onRemove={handleLogoRemove}
              hint={t("imageHint")}
            />
            <ImageUploadZone
              label={t("stamp")}
              previewUrl={stampPreview}
              onFileChange={handleStampChange}
              onRemove={handleStampRemove}
              hint={t("imageHint")}
            />
          </div>
        </div>

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {tCommon("address")}
          </h4>
          <div className="space-y-5">
            <InputGroup
              label={tCommon("street")}
              name="street"
              type="text"
              placeholder={tCommon("streetPlaceholder")}
              value={formik.values.street}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputGroup
                label={tCommon("city")}
                name="city"
                type="text"
                placeholder={tCommon("cityPlaceholder")}
                value={formik.values.city}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("stateRegion")}
                name="state"
                type="text"
                placeholder={tCommon("statePlaceholder")}
                value={formik.values.state}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("postalCode")}
                name="postalCode"
                type="text"
                placeholder={tCommon("postalCodePlaceholder")}
                value={formik.values.postalCode}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("country")}
                name="country"
                type="text"
                placeholder={tCommon("countryPlaceholder")}
                value={formik.values.country}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>

        <Switch
          label={t("storeIsActive")}
          checked={formik.values.isActive}
          onChange={(checked) => formik.setFieldValue("isActive", checked)}
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? tCommon("saving")
              : isEditing
                ? t("updateStore")
                : t("createStore")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            {tCommon("cancel")}
          </button>
        </div>
      </form>
    </FormSection>
  );
}
