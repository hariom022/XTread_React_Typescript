import { useEffect, useState } from "react";
import customerService from "../service/customerService";
import type { Customer } from "../types/customer.types";

const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomerRows, setSelectedCustomerRows] =
    useState<string[]>([]);

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await customerService.getAllCustomers();

      console.log("Customer API Response:", response.data);

      if (response.data?.success) {
        setCustomers(response.data.data || []);
      } else {
        setCustomers([]);

        setError(
          response.data?.error?.message ||
            "Failed to load customers"
        );
      }
    } catch (err: any) {
      console.error("Customer API Error:", err);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      customer.customerNumber
        ?.toLowerCase()
        .includes(search) ||

      customer.customerName
        ?.toLowerCase()
        .includes(search) ||

      customer.searchTerm
        ?.toLowerCase()
        .includes(search) ||

      customer.companyCode
        ?.toLowerCase()
        .includes(search) ||

      customer.salesGroup
        ?.toLowerCase()
        .includes(search) ||

      customer.salesGroupDescription
        ?.toLowerCase()
        .includes(search) ||

      customer.customerGroup
        ?.toLowerCase()
        .includes(search) ||

      customer.customerGroupDescription
        ?.toLowerCase()
        .includes(search) ||

      customer.mobileNumber
        ?.toLowerCase()
        .includes(search) ||

      customer.email
        ?.toLowerCase()
        .includes(search) ||

      customer.city
        ?.toLowerCase()
        .includes(search)
    );
  });

  // =========================
  // SELECT SINGLE CUSTOMER
  // =========================

  const toggleCustomerRow = (
    customerNumber: string
  ) => {
    setSelectedCustomerRows((prev) => {
      if (prev.includes(customerNumber)) {
        return prev.filter(
          (id) => id !== customerNumber
        );
      }

      return [...prev, customerNumber];
    });
  };

  // =========================
  // SELECT ALL
  // =========================

  const toggleAllCustomers = () => {
    if (
      filteredCustomers.length > 0 &&
      selectedCustomerRows.length ===
        filteredCustomers.length
    ) {
      setSelectedCustomerRows([]);
    } else {
      setSelectedCustomerRows(
        filteredCustomers.map(
          (customer) => customer.customerNumber
        )
      );
    }
  };

  return {
    customers,
    filteredCustomers,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    selectedCustomerRows,

    toggleCustomerRow,
    toggleAllCustomers,

    loadCustomers,
  };
};

export default useCustomers;