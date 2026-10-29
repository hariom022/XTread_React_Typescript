
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Category,
  TyreClassification,
  TreadPattern,
} from "../types/pattern.types";

import patternService from "../service/patternService";

const usePatterns = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [classifications, setClassifications] = useState<TyreClassification[]>([]);
  const [patterns, setPatterns] = useState<TreadPattern[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [classificationId, setClassificationId] = useState("");

  const [filtersLoading, setFiltersLoading] = useState(true);
  const [patternsLoading, setPatternsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Load categories and tyre classifications.
  useEffect(() => {
    let active = true;

    const loadFilters = async () => {
      setFiltersLoading(true);
      setError(null);

      try {
        const [categoryResponse, makeResponse] = await Promise.all([
          patternService.getCategories(),
          patternService.getTyreMakes(),
        ]);

        if (!categoryResponse.data.success) {
          throw new Error(
            categoryResponse.data.error || "Failed to load categories."
          );
        }

        if (!makeResponse.data.success) {
          throw new Error(
            makeResponse.data.error || "Failed to load tyre classifications."
          );
        }

        if (!active) return;

        setCategories(categoryResponse.data.data ?? []);

        // Multiple tyre makes may belong to the same classification.
        // Display each classification only once.
        const uniqueClassifications = new Map<
          number,
          TyreClassification
        >();

        for (const make of makeResponse.data.data ?? []) {
          if (!uniqueClassifications.has(make.tyreClassificationId)) {
            uniqueClassifications.set(make.tyreClassificationId, {
              tyreClassificationId: make.tyreClassificationId,
              tyreClassificationName: make.tyreClassificationName,
              tyreClassificationSortOrder:
                make.tyreClassificationSortOrder,
            });
          }
        }

        setClassifications(
          Array.from(uniqueClassifications.values()).sort(
            (a, b) =>
              a.tyreClassificationSortOrder -
              b.tyreClassificationSortOrder
          )
        );
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load filter options."
          );
        }
      } finally {
        if (active) setFiltersLoading(false);
      }
    };

    void loadFilters();

    return () => {
      active = false;
    };
  }, []);

  // Fetch patterns when both filters are selected.
  const loadPatterns = useCallback(async () => {
    if (!categoryId || !classificationId) {
      setPatterns([]);
      setPatternsLoading(false);
      return;
    }

    setPatternsLoading(true);
    setError(null);

    try {
      const response = await patternService.getPatterns(
        Number(categoryId),
        Number(classificationId)
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || "Failed to load tread patterns."
        );
      }

      setPatterns(response.data.data ?? []);
    } catch (err: unknown) {
      setPatterns([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tread patterns."
      );
    } finally {
      setPatternsLoading(false);
    }
  }, [categoryId, classificationId]);

  useEffect(() => {
    void loadPatterns();
  }, [loadPatterns]);

  // Change category and reset old results.
  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPatterns([]);
    setError(null);
  };

  // Change classification and reset old results.
  const handleClassificationChange = (value: string) => {
    setClassificationId(value);
    setPatterns([]);
    setError(null);
  };

  const totalVariants = useMemo(
    () =>
      patterns.reduce(
        (total, pattern) => total + pattern.variants.length,
        0
      ),
    [patterns]
  );

  return {
    categories,
    classifications,
    patterns,
    categoryId,
    classificationId,
    filtersLoading,
    patternsLoading,
    error,
    totalVariants,
    handleCategoryChange,
    handleClassificationChange,
    loadPatterns,
  };
};

export default usePatterns;
