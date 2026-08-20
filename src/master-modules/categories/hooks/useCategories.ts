import { useEffect, useMemo, useState } from "react";
import categoriesService from "../service/categoriesService";
import type { Category } from "../types/categories.types";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await categoriesService.getAllCategories(1);

      if (response.data.success) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);

        setError(
          typeof response.data.error === "string"
            ? response.data.error
            : "Failed to load categories."
        );
      }
    } catch (err: any) {
      setCategories([]);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }

    return categories.filter((item) =>
      [
        item.categoryId,
        item.categoryName,
      ].some((value) =>
        String(value)
          .toLowerCase()
          .includes(searchValue)
      )
    );
  }, [categories, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return {
    categories,
    filteredCategories,

    loading,
    error,

    search,
    handleSearch,

    reload: loadCategories,
  };
};

export default useCategories;