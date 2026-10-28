
import { useState, useEffect, useMemo, useCallback } from "react";
import type { Region, RegionPayload } from "../types/region.types";
import regionService from "../service/regionService";

const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await regionService.getAllRegions();
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to load regions.");
      }

      setRegions(result.data ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load regions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegions();
  }, [loadRegions]);

  const createRegion = async (payload: RegionPayload) => {
    try {
      setSaving(true);
      setError(null);

      const response = await regionService.createRegion(payload);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to create region.");
      }

      await loadRegions();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create region.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateRegion = async (
    regionId: number,
    payload: RegionPayload
  ) => {
    try {
      setSaving(true);
      setError(null);

      const response = await regionService.updateRegion(regionId, payload);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to update region.");
      }

      await loadRegions();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update region.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteRegion = async (regionId: number) => {
    try {
      setError(null);

      const response = await regionService.deleteRegion(regionId);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to delete region.");
      }

      await loadRegions();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete region.";
      setError(message);
      throw err;
    }
  };

  const getRegionById = async (regionId: number) => {
    const response = await regionService.getRegionById(regionId);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to retrieve region.");
    }

    return response.data.data;
  };

  const filteredRegions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return regions;

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
    saving,
    error,
    searchTerm,
    setSearchTerm,
    loadRegions,
    createRegion,
    updateRegion,
    deleteRegion,
    getRegionById,
  };
};

export default useRegions;
