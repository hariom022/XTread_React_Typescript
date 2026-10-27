import { useState, useEffect, useMemo } from "react";
import type { Zone } from "../types/zone.types";
import zoneService from "../service/zoneService";

const useZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await zoneService.getAllZones();
        const result = response.data;

        if (isMounted) {
          if (result.success) {
            setZones(result.data);
          } else {
            setError(result.error || "Failed to retrieve zones.");
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

  const filteredZones = useMemo(() => {
    if (!searchTerm.trim()) return zones;

    const term = searchTerm.toLowerCase();
    return zones.filter(
      (item) =>
        item.zoneName.toLowerCase().includes(term) ||
        item.zoneInitial.toLowerCase().includes(term) ||
        item.regionName.toLowerCase().includes(term) ||
        item.id.toString().includes(term)
    );
  }, [zones, searchTerm]);

  return {
    zones,
    filteredZones,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
};

export default useZones;