// src/features/collection/hooks/useCustomers.ts

import { useEffect, useState } from "react";

import customerService from "../services/customerService";

import type {
  Customer,
} from "../types/collection.types";

const useCustomers = () => {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const res =
        await customerService.getAllCustomers();

      console.log(
        "CUSTOMER RESPONSE",
        res.data,
      );

      // ✅ HANDLE BOTH STRUCTURES
      setCustomers(
        res.data.data || res.data || [],
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load customers",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,

    loading,

    error,

    reloadCustomers:
      loadCustomers,
  };
};

export default useCustomers;