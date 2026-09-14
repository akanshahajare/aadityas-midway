import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAdminMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/adminMenuService";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  categoryName: "",
  categorySlug: "",
  spiceLevel: "",
  servingInfo: "",
  tags: "",
  vegetarian: true,
  jain: false,
  seasonal: false,
  isAddon: false,
  isAvailable: true,
};

const AdminMenuPage = () => {
  const { token } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [editForm, setEditForm] = useState(emptyForm);

  const loadMenuItems = async () => {
    if (!token) {
      setError("Admin authentication required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAdminMenuItems(token);
      setMenuItems(response.data || []);
    } catch (err) {
      console.error("Failed to load admin menu:", err);
      setError("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [token]);

  const categories = useMemo(() => {
    const uniqueCategories = new Map();

    menuItems.forEach((item) => {
      if (item.category?.slug && item.category?.name) {
        uniqueCategories.set(
          item.category.slug,
          item.category.name
        );
      }
    });

    return Array.from(uniqueCategories.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(search)
        );

      const matchesCategory =
        categoryFilter === "all" ||
        item.category?.slug === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.isAvailable) ||
        (availabilityFilter === "unavailable" && !item.isAvailable);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    menuItems,
    searchTerm,
    categoryFilter,
    availabilityFilter,
  ]);

  const openEditModal = (item) => {
    setAddingItem(false);
    setEditingItem(item);
    setSaveError("");

    setEditForm({
      name: item.name || "",
      price: item.price ?? "",
      description: item.description || "",
      categoryName: item.category?.name || "",
      categorySlug: item.category?.slug || "",
      spiceLevel: item.spiceLevel || "",
      servingInfo: item.servingInfo || "",
      tags: Array.isArray(item.tags)
        ? item.tags.join(", ")
        : "",
      vegetarian: item.dietary?.vegetarian ?? true,
      jain: item.dietary?.jain ?? false,
      seasonal: item.seasonal ?? false,
      isAddon: item.isAddon ?? false,
      isAvailable: item.isAvailable ?? true,
    });
  };

  const openAddModal = () => {
    setEditingItem(null);
    setSaveError("");
    setEditForm({ ...emptyForm });
    setAddingItem(true);
  };

  const closeModal = () => {
    if (saving) return;

    setEditingItem(null);
    setAddingItem(false);
    setSaveError("");
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildMenuItemPayload = () => ({
    name: editForm.name.trim(),

    price: Number(editForm.price),

    description: editForm.description.trim(),

    category: {
      name: editForm.categoryName.trim(),
      slug: editForm.categorySlug.trim(),
    },

    spiceLevel: editForm.spiceLevel || null,

    servingInfo:
      editForm.servingInfo.trim() || null,

    tags: editForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),

    dietary: {
      vegetarian: editForm.vegetarian,
      jain: editForm.jain,
    },

    seasonal: editForm.seasonal,

    isAddon: editForm.isAddon,

    isAvailable: editForm.isAvailable,
  });

  const validateForm = () => {
    if (!editForm.name.trim()) {
      return "Item name is required.";
    }

    if (
      editForm.price === "" ||
      Number(editForm.price) < 0
    ) {
      return "Please enter a valid price.";
    }

    if (!editForm.categoryName.trim()) {
      return "Category name is required.";
    }

    if (!editForm.categorySlug.trim()) {
      return "Category slug is required.";
    }

    return "";
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      const payload = buildMenuItemPayload();

      if (editingItem) {
        const response = await updateMenuItem(
          token,
          editingItem._id,
          payload
        );

        const savedItem = response.data;

        setMenuItems((currentItems) =>
          currentItems.map((item) =>
            item._id === editingItem._id
              ? savedItem
              : item
          )
        );
      } else {
        const response = await createMenuItem(
          token,
          payload
        );

        const createdItem = response.data;

        setMenuItems((currentItems) => [
          createdItem,
          ...currentItems,
        ]);
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save menu item:", err);

      setSaveError(
        err.message || "Failed to save menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);
      setError("");

      await deleteMenuItem(token, item._id);

      setMenuItems((currentItems) =>
        currentItems.filter(
          (menuItem) => menuItem._id !== item._id
        )
      );
    } catch (err) {
      console.error("Failed to delete menu item:", err);

      setError(
        err.message || "Failed to delete menu item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-brand-text-secondary">
            Loading menu items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl bg-red-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-800">
            Unable to load menu
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <Link
            to="/admin"
            className="mt-4 inline-block rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Menu Management
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-brand-green">
            Menu Items
          </h1>

          <p className="mt-1 text-sm text-brand-text-secondary">
            Manage dishes, prices, categories and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark"
        >
          + Add Menu Item
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Total Items
          </p>

          <p className="mt-2 text-2xl font-bold text-brand-green">
            {menuItems.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Available
          </p>

          <p className="mt-2 text-2xl font-bold text-green-700">
            {menuItems.filter((item) => item.isAvailable).length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-text-secondary">
            Unavailable
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {menuItems.filter((item) => !item.isAvailable).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search menu items..."
            className="rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
          />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30"
          >
            <option value="all">All Categories</option>

            {categories.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(event.target.value)
            }
            className="rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Menu Table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2 className="font-semibold text-brand-green">
              Menu Catalogue
            </h2>

            <p className="mt-1 text-xs text-brand-text-secondary">
              Showing {filteredItems.length} of {menuItems.length} items
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-brand-green">
              No menu items found
            </p>

            <p className="mt-1 text-sm text-brand-text-secondary">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-brand-cream">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Item
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-border">
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-brand-cream/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                          {item.image?.src ? (
                            <img
                              src={item.image.src}
                              alt={item.image.alt || item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-brand-text-secondary">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-brand-green">
                            {item.name}
                          </p>

                          <p className="mt-1 max-w-md truncate text-xs text-brand-text-secondary">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-medium text-brand-green">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-brand-green">
                      ₹{Number(item.price || 0).toFixed(0)}
                    </td>

                    <td className="px-5 py-4">
                      {item.isAvailable ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-green transition hover:bg-brand-cream"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item._id}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === item._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(editingItem || addingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  Menu Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-brand-green">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h2>

                <p className="mt-1 text-sm text-brand-text-secondary">
                  {editingItem
                    ? "Update the details of this menu item."
                    : "Add a new dish to your restaurant menu."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream text-xl text-brand-text-secondary transition hover:bg-brand-gold/10 hover:text-brand-green disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              <form
                onSubmit={handleSave}
                className="space-y-6"
              >
                {saveError && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                )}

                {/* Basic Details */}
                <div>
                  <div className="mb-3">
                    <h3 className="font-semibold text-brand-green">
                      Basic Details
                    </h3>

                    <p className="mt-1 text-xs text-brand-text-secondary">
                      Enter the main information for this dish.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Item Name
                      </label>

                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Paneer Tikka"
                        className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Price
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-text-secondary">
                          ₹
                        </span>

                        <input
                          name="price"
                          type="number"
                          min="0"
                          value={editForm.price}
                          onChange={handleEditChange}
                          placeholder="250"
                          className="w-full rounded-xl bg-brand-cream py-3 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="3"
                      placeholder="Char-grilled paneer with Indian spices..."
                      className="w-full resize-none rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <div className="mb-3">
                    <h3 className="font-semibold text-brand-green">
                      Category & Serving
                    </h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Category Name
                      </label>

                      <input
                        name="categoryName"
                        value={editForm.categoryName}
                        onChange={handleEditChange}
                        placeholder="Starters"
                        className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Category Slug
                      </label>

                      <input
                        name="categorySlug"
                        value={editForm.categorySlug}
                        onChange={handleEditChange}
                        placeholder="starters"
                        className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Spice Level
                      </label>

                      <select
                        name="spiceLevel"
                        value={editForm.spiceLevel}
                        onChange={handleEditChange}
                        className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                      >
                        <option value="">None</option>
                        <option value="mild">Mild</option>
                        <option value="medium">Medium</option>
                        <option value="spicy">Spicy</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-brand-green">
                        Serving Info
                      </label>

                      <input
                        name="servingInfo"
                        value={editForm.servingInfo}
                        onChange={handleEditChange}
                        placeholder="2 pieces"
                        className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="mb-3 font-semibold text-brand-green">
                    Tags
                  </h3>

                  <input
                    name="tags"
                    value={editForm.tags}
                    onChange={handleEditChange}
                    placeholder="paneer, starter, popular"
                    className="w-full rounded-xl bg-brand-cream px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-gold/30"
                  />

                  <p className="mt-1.5 text-xs text-brand-text-secondary">
                    Separate multiple tags using commas.
                  </p>
                </div>

                {/* Options */}
                <div>
                  <h3 className="mb-3 font-semibold text-brand-green">
                    Item Options
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-brand-cream p-4 transition hover:bg-brand-gold/10">
                      <input
                        type="checkbox"
                        name="vegetarian"
                        checked={editForm.vegetarian}
                        onChange={handleEditChange}
                        className="h-4 w-4 accent-brand-green"
                      />

                      <div>
                        <p className="text-sm font-semibold text-brand-green">
                          Vegetarian
                        </p>

                        <p className="text-xs text-brand-text-secondary">
                          Suitable for vegetarian customers
                        </p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-brand-cream p-4 transition hover:bg-brand-gold/10">
                      <input
                        type="checkbox"
                        name="jain"
                        checked={editForm.jain}
                        onChange={handleEditChange}
                        className="h-4 w-4 accent-brand-green"
                      />

                      <div>
                        <p className="text-sm font-semibold text-brand-green">
                          Jain
                        </p>

                        <p className="text-xs text-brand-text-secondary">
                          Jain-friendly preparation
                        </p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-brand-cream p-4 transition hover:bg-brand-gold/10">
                      <input
                        type="checkbox"
                        name="seasonal"
                        checked={editForm.seasonal}
                        onChange={handleEditChange}
                        className="h-4 w-4 accent-brand-green"
                      />

                      <div>
                        <p className="text-sm font-semibold text-brand-green">
                          Seasonal Item
                        </p>

                        <p className="text-xs text-brand-text-secondary">
                          Mark as a seasonal dish
                        </p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-brand-cream p-4 transition hover:bg-brand-gold/10">
                      <input
                        type="checkbox"
                        name="isAddon"
                        checked={editForm.isAddon}
                        onChange={handleEditChange}
                        className="h-4 w-4 accent-brand-green"
                      />

                      <div>
                        <p className="text-sm font-semibold text-brand-green">
                          Add-on Item
                        </p>

                        <p className="text-xs text-brand-text-secondary">
                          Can be offered as an add-on
                        </p>
                      </div>
                    </label>
                  </div>

                  <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl bg-brand-green p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Item is currently available
                      </p>

                      <p className="mt-0.5 text-xs text-white/70">
                        Customers can order this item
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={editForm.isAvailable}
                      onChange={handleEditChange}
                      className="h-5 w-5 accent-brand-gold"
                    />
                  </label>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl bg-brand-cream px-5 py-3 text-sm font-semibold text-brand-green transition hover:bg-brand-gold/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                        ? "Save Changes"
                        : "Create Menu Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;