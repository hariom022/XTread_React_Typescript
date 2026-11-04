import { useCallback, useEffect, useMemo, useState } from "react";
import customerService from "../service/customerService";
import type { Customer, Region } from "../types/customer.types";

const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // 0 means All Regions
  const [selectedRegionId, setSelectedRegionId] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch regions
  const loadRegions = useCallback(async () => {
    try {
      const response = await customerService.getRegions();

      if (response.data.success && Array.isArray(response.data.data)) {
        setRegions(response.data.data);
      } else {
        setRegions([]);
      }
    } catch (err) {
      console.error("Error loading regions:", err);
      setRegions([]);
    }
  }, []);

  // Fetch customers
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await customerService.getAllCustomers(
        pageNumber,
        pageSize,
        selectedRegionId
      );

      console.log("Customer API Response:", response.data);

      if (response.data.success) {
        const paginationData = response.data.data;

        setCustomers(
          Array.isArray(paginationData?.items)
            ? paginationData.items
            : []
        );

        setTotalRecords(paginationData?.totalCount ?? 0);
        setTotalPages(paginationData?.totalPages ?? 0);
      } else {
        setCustomers([]);
        setTotalRecords(0);
        setTotalPages(0);
        setError(response.data.error || "Unable to load customers.");
      }
    } catch (err: any) {
      console.error("Error loading customers:", err);

      setCustomers([]);
      setTotalRecords(0);
      setTotalPages(0);

      setError(
        err.response?.data?.error ||
          "Failed to load customers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, selectedRegionId]);

  // Load regions once
  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  // Load customers whenever filters or pagination change
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Region filter
  const handleRegionChange = (regionId: number) => {
    setSelectedRegionId(regionId);
    setPageNumber(1);
    setSelectedCustomers([]);
  };

  // Page size
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
    setSelectedCustomers([]);
  };

  // Search current page's customers
  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return customers;

    return customers.filter((customer) =>
      [
        customer.customerNumber,
        customer.customerName,
        customer.searchTerm,
        customer.companyCode,
        customer.salesGroup,
        customer.salesGroupDescription,
        customer.customerGroup,
        customer.customerGroupDescription,
        customer.mobileNumber,
        customer.email,
        customer.priceList,
        customer.priceListDescription,
        customer.city,
        customer.country,
        customer.sourceSystem,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      )
    );
  }, [customers, searchTerm]);

  // Select individual customer
  const handleSelectCustomer = (customerNumber: string) => {
    setSelectedCustomers((previous) =>
      previous.includes(customerNumber)
        ? previous.filter((id) => id !== customerNumber)
        : [...previous, customerNumber]
    );
  };

  // Select all visible customers
  const handleSelectAll = (checked: boolean) => {
    const visibleIds = filteredCustomers.map(
      (customer) => customer.customerNumber
    );

    if (checked) {
      setSelectedCustomers((previous) => [
        ...new Set([...previous, ...visibleIds]),
      ]);
    } else {
      setSelectedCustomers((previous) =>
        previous.filter((id) => !visibleIds.includes(id))
      );
    }
  };

  const isAllSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every((customer) =>
      selectedCustomers.includes(customer.customerNumber)
    );

  return {
    customers: filteredCustomers,
    regions,

    selectedRegionId,
    handleRegionChange,

    searchTerm,
    setSearchTerm,

    selectedCustomers,
    handleSelectCustomer,
    handleSelectAll,
    isAllSelected,

    pageNumber,
    setPageNumber,

    pageSize,
    handlePageSizeChange,

    totalRecords,
    totalPages,

    loading,
    error,

    loadCustomers,
  };
};

export default useCustomers;