import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../services/categoryService";

import { useAuth } from "../context/AuthContext";

const categoryIcons = [
  "🍛",
  "🥘",
  "🍜",
  "🍕",
  "🥗",
  "🍚",
  "🥤",
  "☕",
  "🍰",
  "🥪",
  "🌯",
  "🍲",
];

const emptyForm = {
  name: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

const AdminCategoriesPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadCategories = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const response = await getAdminCategories(token);

      const items = Array.isArray(response)
        ? response
        : response?.data || [];

      setCategories(items);
    } catch (err) {
      console.error("Failed to load categories:", err);

      setError(
        err.message || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const result = !query
      ? categories
      : categories.filter((category) => {
          return (
            category.name
              ?.toLowerCase()
              .includes(query) ||
            category.slug
              ?.toLowerCase()
              .includes(query) ||
            category.description
              ?.toLowerCase()
              .includes(query)
          );
        });

    return [...result].sort(
      (a, b) =>
        (a.displayOrder || 0) -
          (b.displayOrder || 0) ||
        a.name.localeCompare(b.name)
    );
  }, [categories, searchTerm]);

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories =
    totalCategories - activeCategories;

  const totalItems = categories.reduce(
    (total, category) =>
      total + (Number(category.itemCount) || 0),
    0
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setActionMessage("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive !== false,
    });

    setActionMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "displayOrder"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setActionMessage(
        "You must be logged in as an admin."
      );
      return;
    }

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setActionMessage(
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setActionMessage("");

      const payload = {
        name: trimmedName,
        description: form.description.trim(),
        displayOrder: Number(form.displayOrder) || 0,
        isActive: Boolean(form.isActive),
      };

      if (editingCategory) {
        await updateCategory(
          editingCategory._id,
          payload,
          token
        );

        setActionMessage(
          "Category updated successfully."
        );
      } else {
        await createCategory(payload, token);

        setActionMessage(
          "Category created successfully."
        );
      }

      await loadCategories();

      setTimeout(() => {
        setShowModal(false);
        setEditingCategory(null);
        setForm(emptyForm);
        setActionMessage("");
      }, 500);
    } catch (err) {
      console.error(
        "Failed to save category:",
        err
      );

      setActionMessage(
        err.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category) => {
    if (!token) return;

    try {
      setActionMessage("");

      await updateCategory(
        category._id,
        {
          isActive: !category.isActive,
        },
        token
      );

      setCategories((current) =>
        current.map((item) =>
          item._id === category._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Failed to update category status:",
        err
      );

      setActionMessage(
        err.message ||
          "Failed to update category status."
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;

    try {
      setSaving(true);
      setActionMessage("");

      await deleteCategory(
        deleteTarget._id,
        token
      );

      setCategories((current) =>
        current.filter(
          (category) =>
            category._id !== deleteTarget._id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "Failed to delete category:",
        err
      );

      setActionMessage(
        err.message ||
          "Failed to delete category."
      );

      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  const handleViewItems = (category) => {
    navigate("/admin/menu", {
      state: {
        categoryId: category._id,
        categorySlug: category.slug,
        categoryName: category.name,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-full bg-brand-cream p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />

              <p className="mt-4 text-sm text-text-secondary">
                Loading categories...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-brand-cream p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-bold text-red-800">
              Unable to load categories
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCategories}
              className="mt-4 rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-brand-cream p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
              Menu Management
            </p>

            <h1 className="mt-1 font-display text-3xl font-bold text-brand-green-dark">
              Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Create, organize, activate and manage
              categories for your restaurant menu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/menu")
              }
              className="inline-flex items-center justify-center rounded-xl border border-brand-green/20 bg-brand-white px-4 py-3 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-cream"
            >
              Manage Menu
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark"
            >
              <span className="text-lg leading-none">
                +
              </span>
              Add Category
            </button>
          </div>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className="mt-5 rounded-xl border border-brand-gold/20 bg-brand-gold/5 px-4 py-3 text-sm font-medium text-brand-green-dark">
            {actionMessage}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Categories
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
              {totalCategories}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Total categories
            </p>
          </div>

          <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Active
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
              {activeCategories}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Visible to customers
            </p>
          </div>

          <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Inactive
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
              {inactiveCategories}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Hidden categories
            </p>
          </div>

          <div className="rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Menu Items
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-brand-green-dark">
              {totalItems}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Assigned to categories
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 rounded-2xl border border-brand-green/10 bg-brand-white p-4 shadow-sm">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search categories..."
              className="w-full rounded-xl border border-brand-green/10 bg-brand-cream py-3 pl-10 pr-4 text-sm text-brand-green-dark outline-none transition placeholder:text-text-secondary focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-brand-green/10 bg-brand-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream text-3xl">
                🍽️
              </div>

              <h2 className="mt-4 font-display text-xl font-bold text-brand-green-dark">
                No categories found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                {searchTerm
                  ? "Try a different category name."
                  : "Create your first menu category to get started."}
              </p>

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="mt-4 rounded-xl border border-brand-green/20 px-4 py-2 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-cream"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-4 rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                >
                  Add Category
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCategories.map(
                (category, index) => {
                  const itemCount =
                    Number(category.itemCount) || 0;

                  return (
                    <div
                      key={category._id}
                      className="group rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-2xl">
                            {
                              categoryIcons[
                                index %
                                  categoryIcons.length
                              ]
                            }
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate font-display text-lg font-bold text-brand-green-dark">
                              {category.name}
                            </h2>

                            <p className="mt-0.5 truncate text-xs text-text-secondary">
                              /{category.slug}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            category.isActive
                              ? "bg-brand-green/10 text-brand-green"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mt-4 min-h-[40px]">
                        <p className="line-clamp-2 text-xs leading-5 text-text-secondary">
                          {category.description ||
                            "No description added for this category."}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-brand-cream p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                            Items
                          </p>

                          <p className="mt-1 text-lg font-bold text-brand-green-dark">
                            {itemCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-brand-cream p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                            Order
                          </p>

                          <p className="mt-1 text-lg font-bold text-brand-green-dark">
                            {category.displayOrder ??
                              0}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-green/10 pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewItems(category)
                          }
                          className="rounded-xl bg-brand-green px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-green-dark"
                        >
                          View Items
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(category)
                          }
                          className="rounded-xl border border-brand-green/20 px-3.5 py-2 text-xs font-semibold text-brand-green-dark transition hover:bg-brand-cream"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(
                              category
                            )
                          }
                          className="rounded-xl border border-brand-green/20 px-3.5 py-2 text-xs font-semibold text-brand-green-dark transition hover:bg-brand-cream"
                        >
                          {category.isActive
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(
                              category
                            )
                          }
                          className="ml-auto rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="mt-8 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0 text-lg">
              ℹ️
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-green-dark">
                Category management
              </h3>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Categories are now stored separately from
                menu items. You can create categories here,
                assign them to menu items, control their
                visibility and change their display order.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-brand-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-brand-green/10 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
                  Category Management
                </p>

                <h2 className="mt-1 font-display text-2xl font-bold text-brand-green-dark">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-text-secondary transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-brand-green-dark">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Pizzas"
                  required
                  className="w-full rounded-xl border border-brand-green/15 bg-brand-cream px-4 py-3 text-sm text-brand-green-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-brand-green-dark">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Short description for this category"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-brand-green/15 bg-brand-cream px-4 py-3 text-sm text-brand-green-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-brand-green-dark">
                  Display Order
                </label>

                <input
                  type="number"
                  name="displayOrder"
                  min="0"
                  value={form.displayOrder}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-brand-green/15 bg-brand-cream px-4 py-3 text-sm text-brand-green-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />

                <p className="mt-1 text-xs text-text-secondary">
                  Lower numbers appear first.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-green/10 bg-brand-cream p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 accent-brand-green"
                />

                <div>
                  <p className="text-sm font-semibold text-brand-green-dark">
                    Active category
                  </p>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Active categories can be shown to customers.
                  </p>
                </div>
              </label>

              {actionMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-brand-green/10 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-brand-green/20 px-5 py-2.5 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-brand-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠️
            </div>

            <h2 className="mt-4 font-display text-xl font-bold text-brand-green-dark">
              Delete Category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              You are about to delete{" "}
              <span className="font-semibold text-brand-green-dark">
                {deleteTarget.name}
              </span>
              . If menu items are still assigned to
              this category, the backend may prevent the
              deletion.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={saving}
                className="rounded-xl border border-brand-green/20 px-4 py-2.5 text-sm font-semibold text-brand-green-dark transition hover:bg-brand-cream"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Deleting..."
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;