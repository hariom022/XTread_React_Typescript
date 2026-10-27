import { useState, useEffect, useMemo } from "react";
import type { Region } from "../types/region.types";
import regionService from "../service/regionService";

const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await regionService.getAllRegions();
        const result = response.data;

        if (isMounted) {
          if (result.success) {
            setRegions(result.data);
          } else {
            setError(result.error || "Failed to retrieve regions.");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRegions = useMemo(() => {
    if (!searchTerm.trim()) return regions;

    const term = searchTerm.toLowerCase();
    return regions.filter(
      (item) =>
        item.regionName.toLowerCase().includes(term) ||
        item.regionInitial.toLowerCase().includes(term) ||
        item.id.toString().includes(term)
    );
  }, [regions, searchTerm]);

  return {
    regions,
    filteredRegions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
};

export default useRegions;