import { useEffect, useState } from "react";
import { getCategories } from "../../services/menuService";

const CategoryTabs = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="border-b border-brand-green/10 bg-brand-white">
      <div className="container-midway">
        <div className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* All */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              selectedCategory === "all"
                ? "bg-brand-green text-brand-white"
                : "bg-brand-cream text-text-secondary hover:bg-brand-green/10 hover:text-brand-green"
            }`}
          >
            All Menu
          </button>

          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category.slug
                  ? "bg-brand-green text-brand-white"
                  : "bg-brand-cream text-text-secondary hover:bg-brand-green/10 hover:text-brand-green"
              }`}
            >
              {category.name}

              <span className="ml-2 text-xs opacity-60">
                {category.itemCount}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;