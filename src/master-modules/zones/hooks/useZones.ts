
import { useState, useEffect, useMemo, useCallback } from "react";
import type { Zone, ZonePayload } from "../types/zone.types";
import type { Region } from "../../region/types/region.types";
import zoneService from "../service/zoneService";

const useZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await zoneService.getAllZones();

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to load zones.");
      }

      setZones(response.data.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load zones.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRegions = useCallback(async () => {
    const response = await zoneService.getRegions();

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to load regions.");
    }

    setRegions(response.data.data ?? []);
  }, []);

  useEffect(() => {
    void loadZones();
    void loadRegions().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load regions.");
    });
  }, [loadZones, loadRegions]);

  const getZoneById = async (id: number) => {
    const response = await zoneService.getZoneById(id);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to load zone.");
    }

    return response.data.data;
  };

  const createZone = async (payload: ZonePayload) => {
    try {
      setSaving(true);
      setError(null);

      const response = await zoneService.createZone(payload);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to create zone.");
      }

      await loadZones();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create zone.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateZone = async (id: number, payload: ZonePayload) => {
    try {
      setSaving(true);
      setError(null);

      const response = await zoneService.updateZone(id, payload);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to update zone.");
      }

      await loadZones();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update zone.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteZone = async (id: number) => {
    try {
      setError(null);

      const response = await zoneService.deleteZone(id);

      if (response.data.success === false) {
        throw new Error(response.data.error || "Failed to delete zone.");
      }

      await loadZones();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete zone.";
      setError(message);
      throw err;
    }
  };

  const filteredZones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return zones;

    return zones.filter(
      (item) =>
        item.zoneName.toLowerCase().includes(term) ||
        item.zoneInitial.toLowerCase().includes(term) ||
        (item.regionName ?? "").toLowerCase().includes(term) ||
        String(item.id).includes(term)
    );
  }, [zones, searchTerm]);

  return {
    zones,
    regions,
    filteredZones,
    loading,
    saving,
    error,
    searchTerm,
    setSearchTerm,
    loadZones,
    getZoneById,
    createZone,
    updateZone,
    deleteZone,
  };
};

export default useZones;
