import { useState } from "react";

import type {
  Customer,
  CustomerSearchRequest,
} from "../types/customerSearch.type";

import customerSearchService from "../services/customerSearchService";

const useCustomerSearch = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [customerList, setCustomerList] = useState<Customer[]>([]);

  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  const searchCustomers = async (
    payload: CustomerSearchRequest,
  ) => {
    try {
      setSearchLoading(true);
      setError(null);

      const response =
        await customerSearchService.searchCustomers(payload);

      setCustomerList(response);

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to retrieve customer information.";

      setError(message);

      throw err;
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  const saveCustomer = async (
    customer: Customer,
  ) => {
    try {
      setSaveLoading(true);
      setError(null);

      console.log("HOOK: Calling customerSearchService.saveCustomer");

      const response =
        await customerSearchService.saveCustomer(customer);

      console.log("HOOK: Save response:", response);

      return response;
    } catch (err) {
      console.error("HOOK: Save customer error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the customer.";

      setError(message);

      throw err;
    } finally {
      setSaveLoading(false);
    }
  };

  // ==========================================
  // CLEAR
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
    searchLoading,
    saveLoading,
    error,
  };
};

export default useCustomerSearch;