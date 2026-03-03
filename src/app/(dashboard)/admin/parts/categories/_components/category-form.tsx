"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { Category } from "@/types";

type Props = {
  category?: Category;
};

const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(100, "Name must be at most 100 characters")
    .required("Category name is required"),
  description: Yup.string(),
  imageUrl: Yup.string()
    .max(500, "URL must be at most 500 characters")
    .url("Must be a valid URL")
    .nullable(),
});

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEditing = !!category;
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
    },
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        if (isEditing) {
          const { updateCategory } = await import(
            "@/services/categories.service"
          );
          await updateCategory(category.id, values);
          router.push("/admin/parts/categories");
        } else {
          const { createCategory } = await import(
            "@/services/categories.service"
          );
          await createCategory(values);
          router.push("/admin/parts/categories");
        }
        router.refresh();
      } catch {
        setServerError("Failed to save category. Please try again.");
      }
    },
  });

  return (
    <FormSection title={isEditing ? "Edit Category" : "New Category"}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <InputGroup
          label="Category Name"
          name="name"
          type="text"
          placeholder="e.g. Engine Parts"
          value={formik.values.name}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Optional description for this category"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <InputGroup
          label="Image URL"
          name="imageUrl"
          type="text"
          placeholder="https://example.com/image.png"
          value={formik.values.imageUrl}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.imageUrl ? formik.errors.imageUrl : undefined}
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Category"
                : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </FormSection>
  );
}
