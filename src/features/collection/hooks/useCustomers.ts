
import { useCallback, useEffect, useState } from "react";

import customerService from "../services/customerService";
import type { Customer } from "../types/collection.types";

const useCustomers = (selectedRegionId: string) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    if (!selectedRegionId) {
      setCustomers([]);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await customerService.getCustomersByRegion(
        Number(selectedRegionId),
      );

      setCustomers(res.data?.data ?? []);
    } catch (err) {
      console.error("Failed to load customers by region:", err);
      setCustomers([]);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    let cancelled = false;

    const fetchCustomers = async () => {
      if (!selectedRegionId) {
        setCustomers([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await customerService.getCustomersByRegion(
          Number(selectedRegionId),
        );

        if (!cancelled) {
          setCustomers(res.data?.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load customers by region:", err);
          setCustomers([]);
          setError("Failed to load customers.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, [selectedRegionId]);

  return {
    customers,
    loading,
    error,
    reloadCustomers: loadCustomers,
  };
};

export default useCustomers;
