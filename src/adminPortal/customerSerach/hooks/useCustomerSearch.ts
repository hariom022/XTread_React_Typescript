import { useState } from "react";

import type {
  Customer,
  CustomerSearchRequest,
} from "../types/customerSearch.type";

import customerSearchService from "../services/customerSearchService";

const useCustomerSearch = () => {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [customerList, setCustomerList] =
    useState<Customer[]>([]);

  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  const searchCustomers = async (
    payload: CustomerSearchRequest,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await customerSearchService.searchCustomers(
          payload,
        );

      setCustomerList(response);

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while searching customers.";

      setError(message);

      setCustomerList([]);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  const saveCustomer = async (
    customer: Customer,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await customerSearchService.saveCustomer(
          customer,
        );

      if (!response.success) {
        setError(response.message);
      }

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the customer.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR RESULTS
  // ==========================================

  const clearResults = () => {
    setCustomerList([]);
    setError(null);
  };

  return {
    searchCustomers,
    saveCustomer,
    clearResults,
    customerList,
    loading,
    error,
  };
};

export default useCustomerSearch;