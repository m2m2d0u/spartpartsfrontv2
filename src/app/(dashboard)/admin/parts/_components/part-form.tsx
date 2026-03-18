"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { SearchableMultiSelect } from "@/components/FormElements/searchable-multi-select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import { FormDialog } from "@/components/ui/form-dialog";
import { useLookup } from "@/stores/lookup-store";
import type { Part, Category } from "@/types";
import { PartImageUpload } from "./part-image-upload";
import { InitialStockModal } from "./initial-stock-modal";

type Props = {
  part?: Part;
  categories: Category[];
};

export function PartForm({ part, categories: initialCategories }: Props) {
  const router = useRouter();
  const isEditing = !!part;
  const [serverError, setServerError] = useState("");
  const [localCategories, setLocalCategories] = useState(initialCategories);
  const [showStockModal, setShowStockModal] = useState(false);
  const [createdPart, setCreatedPart] = useState<{
    id: string;
    name: string;
    partNumber: string;
  } | null>(null);
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const {
    brands,
    getModelsByBrand,
    tags,
    invalidateBrands,
    invalidateModels,
    invalidateTags,
  } = useLookup();

  const partSchema = Yup.object({
    partNumber: Yup.string()
      .trim()
      .max(50, tVal("partNumberMaxLength", { max: 50 }))
      .required(tVal("partNumberRequired")),
    reference: Yup.string()
      .max(100, tVal("referenceMaxLength", { max: 100 })),
    name: Yup.string()
      .trim()
      .max(200, tVal("partNameMaxLength", { max: 200 }))
      .required(tVal("partNameRequired")),
    shortDescription: Yup.string().max(
      500,
      tVal("shortDescriptionMaxLength", { max: 500 }),
    ),
    description: Yup.string(),
    categoryId: Yup.string(),
    carBrandId: Yup.string(),
    carModelId: Yup.string(),
    sellingPrice: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .required(tVal("sellingPriceRequired")),
    purchasePrice: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .required(tVal("purchasePriceRequired")),
    minStockLevel: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .integer(tVal("mustBeWholeNumber")),
    published: Yup.boolean(),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      partNumber: part?.partNumber || "",
      reference: part?.reference || "",
      name: part?.name || "",
      description: part?.description || "",
      shortDescription: part?.shortDescription || "",
      categoryId: part?.categoryId || "",
      carBrandId: part?.carBrandId || "",
      carModelId: part?.carModelId || "",
      tagIds: part?.tags?.map((t) => t.id) || ([] as string[]),
      sellingPrice: part?.sellingPrice?.toString() || "",
      purchasePrice: part?.purchasePrice?.toString() || "",
      minStockLevel: part?.minStockLevel?.toString() || "0",
      published: part?.published ?? false,
      notes: part?.notes || "",
    },
    validationSchema: partSchema,
    onSubmit: async (values) => {
      setServerError("");
      const payload = {
        partNumber: values.partNumber,
        reference: values.reference || undefined,
        name: values.name,
        description: values.description || undefined,
        shortDescription: values.shortDescription || undefined,
        categoryId: values.categoryId || undefined,
        carBrandId: values.carBrandId || undefined,
        carModelId: values.carModelId || undefined,
        tagIds: values.tagIds.length > 0 ? values.tagIds : undefined,
        sellingPrice: parseFloat(values.sellingPrice as string),
        purchasePrice: parseFloat(values.purchasePrice as string),
        minStockLevel: parseInt(values.minStockLevel as string) || 0,
        published: values.published,
        notes: values.notes || undefined,
      };

      try {
        if (isEditing) {
          const { updatePart } = await import("@/services/parts.service");
          await updatePart(part.id, payload);
          router.push(`/admin/parts/${part.id}`);
          router.refresh();
        } else {
          const { createPart } = await import("@/services/parts.service");
          const created = await createPart(payload);
          // Show initial stock modal instead of immediately redirecting
          setCreatedPart({
            id: created.id,
            name: created.name,
            partNumber: created.partNumber,
          });
          setShowStockModal(true);
        }
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  const categoryItems = localCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const brandItems = useMemo(() => {
    const items = brands.map((b) => ({
      value: b.id,
      label: b.name,
    }));
    // Ensure the part's current brand is always in the list (even before lookup loads)
    if (part?.carBrandId && part.carBrandName && !items.some((i) => i.value === part.carBrandId)) {
      items.unshift({ value: part.carBrandId, label: part.carBrandName });
    }
    return items;
  }, [brands, part?.carBrandId, part?.carBrandName]);

  const modelItems = useMemo(() => {
    if (!formik.values.carBrandId) return [];
    const items = getModelsByBrand(formik.values.carBrandId).map((m) => ({
      value: m.id,
      label: m.name,
    }));
    // Ensure the part's current model is always in the list
    if (part?.carModelId && part.carModelName && !items.some((i) => i.value === part.carModelId)) {
      items.unshift({ value: part.carModelId, label: part.carModelName });
    }
    return items;
  }, [formik.values.carBrandId, getModelsByBrand, part?.carModelId, part?.carModelName]);

  const tagItems = useMemo(() => {
    const items = tags.map((t) => ({
      value: t.id,
      label: t.name,
    }));
    // Ensure the part's current tags are always in the list
    if (part?.tags) {
      for (const tag of part.tags) {
        if (!items.some((i) => i.value === tag.id)) {
          items.push({ value: tag.id, label: tag.name });
        }
      }
    }
    return items;
  }, [tags, part?.tags]);

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  function handleBrandChange(value: string) {
    formik.setFieldValue("carBrandId", value);
    // Reset model when brand changes
    formik.setFieldValue("carModelId", "");
  }

  function handleStockComplete() {
    if (createdPart) {
      router.push(`/admin/parts/${createdPart.id}`);
      router.refresh();
    }
  }

  function handleStockSkip() {
    if (createdPart) {
      router.push(`/admin/parts/${createdPart.id}`);
      router.refresh();
    }
  }

  /* ── Inline creation state ─────────────────────────────── */
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createBrandOpen, setCreateBrandOpen] = useState(false);
  const [createModelOpen, setCreateModelOpen] = useState(false);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  function handleCreateCategory(searchTerm: string) {
    setNewCategoryName(searchTerm);
    setCreateError("");
    setCreateCategoryOpen(true);
  }

  async function handleSubmitNewCategory() {
    if (!newCategoryName.trim()) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const { createCategory } = await import("@/services/categories.service");
      const created = await createCategory({ name: newCategoryName.trim() });
      setLocalCategories((prev) => [...prev, created]);
      formik.setFieldValue("categoryId", created.id);
      setCreateCategoryOpen(false);
      setNewCategoryName("");
    } catch {
      setCreateError(t("failedCreateCategory"));
    } finally {
      setCreateLoading(false);
    }
  }

  function handleCreateBrand(searchTerm: string) {
    setNewBrandName(searchTerm);
    setCreateError("");
    setCreateBrandOpen(true);
  }

  async function handleSubmitNewBrand() {
    if (!newBrandName.trim()) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const { createCarBrand } = await import(
        "@/services/car-brands.service"
      );
      const created = await createCarBrand({ name: newBrandName.trim() });
      invalidateBrands();
      formik.setFieldValue("carBrandId", created.id);
      formik.setFieldValue("carModelId", "");
      setCreateBrandOpen(false);
      setNewBrandName("");
    } catch {
      setCreateError(t("failedCreateBrand"));
    } finally {
      setCreateLoading(false);
    }
  }

  function handleCreateModel(searchTerm: string) {
    setNewModelName(searchTerm);
    setCreateError("");
    setCreateModelOpen(true);
  }

  async function handleSubmitNewModel() {
    if (!newModelName.trim() || !formik.values.carBrandId) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const { createCarModel } = await import(
        "@/services/car-models.service"
      );
      const created = await createCarModel({
        name: newModelName.trim(),
        brandId: formik.values.carBrandId,
      });
      invalidateModels();
      formik.setFieldValue("carModelId", created.id);
      setCreateModelOpen(false);
      setNewModelName("");
    } catch {
      setCreateError(t("failedCreateModel"));
    } finally {
      setCreateLoading(false);
    }
  }

  function handleCreateTag(searchTerm: string) {
    setNewTagName(searchTerm);
    setCreateError("");
    setCreateTagOpen(true);
  }

  async function handleSubmitNewTag() {
    if (!newTagName.trim()) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const { createTag } = await import("@/services/tags.service");
      const created = await createTag({ name: newTagName.trim() });
      invalidateTags();
      // Auto-select the newly created tag
      formik.setFieldValue("tagIds", [...formik.values.tagIds, created.id]);
      setCreateTagOpen(false);
      setNewTagName("");
    } catch {
      setCreateError(t("failedCreateTag"));
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <FormSection title={isEditing ? t("editPart") : t("newPart")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label={t("partNumber")}
            name="partNumber"
            type="text"
            placeholder={t("partNumberPlaceholder")}
            required
            value={formik.values.partNumber}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("partNumber")}
          />
          <InputGroup
            label={t("reference")}
            name="reference"
            type="text"
            placeholder={t("referencePlaceholder")}
            value={formik.values.reference}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("reference")}
          />
          <InputGroup
            label={t("partName")}
            name="name"
            type="text"
            placeholder={t("partNamePlaceholder")}
            required
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
        </div>

        <InputGroup
          label={t("shortDescription")}
          name="shortDescription"
          type="text"
          placeholder={t("shortDescriptionPlaceholder")}
          value={formik.values.shortDescription}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("shortDescription")}
        />

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("description")}
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder={t("descriptionPlaceholder")}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <SearchableSelect
          label={t("category")}
          name="categoryId"
          placeholder={t("selectCategory")}
          items={categoryItems}
          value={formik.values.categoryId}
          onChange={(val) => formik.setFieldValue("categoryId", val)}
          onBlur={() => formik.setFieldTouched("categoryId", true)}
          error={fieldError("categoryId")}
          onCreateNew={handleCreateCategory}
          createNewLabel={(term) => t("createNewCategory", { name: term })}
        />

        {/* Car Brand & Model */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SearchableSelect
            label={t("carBrand")}
            name="carBrandId"
            placeholder={t("selectCarBrand")}
            items={brandItems}
            value={formik.values.carBrandId}
            onChange={handleBrandChange}
            onBlur={() => formik.setFieldTouched("carBrandId", true)}
            error={fieldError("carBrandId")}
            onCreateNew={handleCreateBrand}
            createNewLabel={(term) => t("createNewBrand", { name: term })}
          />
          <SearchableSelect
            label={t("carModel")}
            name="carModelId"
            placeholder={t("selectCarModel")}
            items={modelItems}
            value={formik.values.carModelId}
            onChange={(val) => formik.setFieldValue("carModelId", val)}
            onBlur={() => formik.setFieldTouched("carModelId", true)}
            error={fieldError("carModelId")}
            onCreateNew={
              formik.values.carBrandId ? handleCreateModel : undefined
            }
            createNewLabel={(term) => t("createNewModel", { name: term })}
          />
        </div>

        {/* Tags */}
        <SearchableMultiSelect
          label={t("tagsLabel")}
          placeholder={t("selectTags")}
          searchPlaceholder={t("searchTags")}
          items={tagItems}
          value={formik.values.tagIds}
          onChange={(ids) => formik.setFieldValue("tagIds", ids)}
          onCreateNew={handleCreateTag}
          createNewLabel={(term) => t("createNewTag", { name: term })}
          selectedLabel={(count) => t("tagsSelected", { count })}
        />

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {t("pricing")}
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <InputGroup
              label={t("sellingPrice")}
              name="sellingPrice"
              type="number"
              placeholder="0"
              required
              value={formik.values.sellingPrice}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("sellingPrice")}
            />
            <InputGroup
              label={t("purchasePrice")}
              name="purchasePrice"
              type="number"
              placeholder="0"
              required
              value={formik.values.purchasePrice}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("purchasePrice")}
            />
            <InputGroup
              label={t("minStockLevel")}
              name="minStockLevel"
              type="number"
              placeholder="0"
              value={formik.values.minStockLevel}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("minStockLevel")}
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("internalNotes")}
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder={t("internalNotesPlaceholder")}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <Switch
          label={t("publishedLabel")}
          checked={formik.values.published}
          onChange={(checked) => formik.setFieldValue("published", checked)}
        />

        {isEditing && part && (
          <div className="border-t border-stroke pt-5 dark:border-dark-3">
            <PartImageUpload partId={part.id} initialImages={part.images} />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? tCommon("saving")
              : isEditing
                ? t("updatePart")
                : t("createPart")}
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

      {/* Inline create category dialog */}
      <FormDialog
        open={createCategoryOpen}
        onClose={() => {
          setCreateCategoryOpen(false);
          setCreateError("");
        }}
        onSubmit={handleSubmitNewCategory}
        title={t("quickCreateCategory")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={createLoading}
      >
        {createError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {createError}
          </div>
        )}
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("categoryNameLabel")}
          </label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={t("categoryNamePlaceholder")}
            autoFocus
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormDialog>

      {/* Inline create brand dialog */}
      <FormDialog
        open={createBrandOpen}
        onClose={() => {
          setCreateBrandOpen(false);
          setCreateError("");
        }}
        onSubmit={handleSubmitNewBrand}
        title={t("quickCreateBrand")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={createLoading}
      >
        {createError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {createError}
          </div>
        )}
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("brandNameLabel")}
          </label>
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder={t("brandNamePlaceholder")}
            autoFocus
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormDialog>

      {/* Inline create model dialog */}
      <FormDialog
        open={createModelOpen}
        onClose={() => {
          setCreateModelOpen(false);
          setCreateError("");
        }}
        onSubmit={handleSubmitNewModel}
        title={t("quickCreateModel")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={createLoading}
      >
        {createError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {createError}
          </div>
        )}
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("modelNameLabel")}
          </label>
          <input
            type="text"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            placeholder={t("modelNamePlaceholder")}
            autoFocus
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormDialog>

      {/* Inline create tag dialog */}
      <FormDialog
        open={createTagOpen}
        onClose={() => {
          setCreateTagOpen(false);
          setCreateError("");
        }}
        onSubmit={handleSubmitNewTag}
        title={t("quickCreateTag")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={createLoading}
      >
        {createError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {createError}
          </div>
        )}
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("tagNameLabel")}
          </label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder={t("tagNamePlaceholder")}
            autoFocus
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormDialog>

      {/* Initial stock modal (shown after creating a new part) */}
      {createdPart && (
        <InitialStockModal
          open={showStockModal}
          partId={createdPart.id}
          partName={createdPart.name}
          partNumber={createdPart.partNumber}
          onComplete={handleStockComplete}
          onSkip={handleStockSkip}
        />
      )}
    </FormSection>
  );
}
