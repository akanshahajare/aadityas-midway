import { useEffect, useMemo, useState } from "react";
import MenuHeader from "../components/menu/MenuHeader";
import MenuSearch from "../components/menu/MenuSearch";
import CategoryTabs from "../components/menu/CategoryTabs";
import MenuGrid from "../components/menu/MenuGrid";
import { getMenu } from "../services/menuService";

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);

        const response = await getMenu();

        if (response.success) {
          setItems(response.data);
        } else {
          setError("Unable to load menu.");
        }
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError("Unable to connect to the menu service.");
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?.slug === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category?.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <MenuHeader />

      <div className="sticky top-20 z-40 border-b border-brand-green/10 bg-brand-cream/95 py-4 backdrop-blur-md">
        <MenuSearch
          value={search}
          onChange={setSearch}
        />
      </div>

      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="section-padding">
        <div className="container-midway">

          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-green">
                {loading
                  ? "Loading menu..."
                  : `${filteredItems.length} dishes`}
              </p>

              {search && (
                <p className="mt-1 text-xs text-text-muted">
                  Results for "{search}"
                </p>
              )}
            </div>

            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-sm font-semibold text-brand-green underline decoration-brand-gold decoration-2 underline-offset-4"
              >
                Clear category
              </button>
            )}
          </div>

          <MenuGrid
            items={filteredItems}
            loading={loading}
            error={error}
          />

        </div>
      </main>
    </div>
  );
};

export default MenuPage;