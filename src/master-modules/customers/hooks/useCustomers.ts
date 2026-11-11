import { useCallback, useEffect, useMemo, useState } from "react";
import customerService from "../service/customerService";
import type { Customer, Region } from "../types/customer.types";

const useCustomers = () => {
  // Store all records fetched from backend
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // 0 means All Regions
  const [selectedRegionId, setSelectedRegionId] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  // Fetch all customers once
  const loadCustomers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const BATCH_SIZE = 100;

    // 1. Fetch Page 1 first to get total records count
    const firstPageResponse = await customerService.getAllCustomers(
      1,
      BATCH_SIZE,
      0
    );

    if (!firstPageResponse.data.success) {
      setAllCustomers([]);
      setError(firstPageResponse.data.error || "Unable to load customers.");
      return;
    }

    const firstData = firstPageResponse.data.data;
    const initialItems: Customer[] = Array.isArray(firstData?.items)
      ? firstData.items
      : Array.isArray(firstData)
      ? firstData
      : [];

    const totalCount = firstData?.totalCount ?? initialItems.length;
    const calculatedTotalPages = Math.ceil(totalCount / BATCH_SIZE);

    // 2. If all records fit in page 1, set and return
    if (calculatedTotalPages <= 1) {
      setAllCustomers(initialItems);
      return;
    }

    // 3. Fetch all remaining pages dynamically in parallel
    const remainingPagePromises = [];
    for (let page = 2; page <= calculatedTotalPages; page++) {
      remainingPagePromises.push(
        customerService.getAllCustomers(page, BATCH_SIZE, 0)
      );
    }

    const remainingResponses = await Promise.all(remainingPagePromises);

    const remainingItems: Customer[] = remainingResponses.flatMap(
      (res) => res.data?.data?.items ?? []
    );

    // 4. Combine all pages into allCustomers (100 + 426 = 526)
    setAllCustomers([...initialItems, ...remainingItems]);
  } catch (err: any) {
    console.error("Error loading customers:", err);
    setAllCustomers([]);
    setError(
      err.response?.data?.error ||
        "Failed to load customers. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadRegions();
    loadCustomers();
  }, [loadRegions, loadCustomers]);

  // 1. Filter ALL records by Region and Search Term
  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return allCustomers.filter((customer) => {
      // Region match (adjust property name if your model uses regionId or similar)
      const matchesRegion =
        selectedRegionId === 0 ||
        (customer as any).regionId === selectedRegionId;

      if (!matchesRegion) return false;
      if (!search) return true;

      return [
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
      );
    });
  }, [allCustomers, selectedRegionId, searchTerm]);

  // 2. Compute dynamic counts based on filtered results
  const totalRecords = filteredCustomers.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  // 3. Slice records for the current page only
  const paginatedCustomers = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, pageNumber, pageSize]);

  // Reset page to 1 whenever search, region, or page size changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPageNumber(1);
  };

  const handleRegionChange = (regionId: number) => {
    setSelectedRegionId(regionId);
    setPageNumber(1);
    setSelectedCustomers([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
    setSelectedCustomers([]);
  };

  // Select individual customer
  const handleSelectCustomer = (customerNumber: string) => {
    setSelectedCustomers((previous) =>
      previous.includes(customerNumber)
        ? previous.filter((id) => id !== customerNumber)
        : [...previous, customerNumber]
    );
  };

  // Select all visible customers on current page
  const handleSelectAll = (checked: boolean) => {
    const visibleIds = paginatedCustomers.map(
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
    paginatedCustomers.length > 0 &&
    paginatedCustomers.every((customer) =>
      selectedCustomers.includes(customer.customerNumber)
    );

  return {
    customers: paginatedCustomers, // Passes only the current sliced page to the table
    regions,

    selectedRegionId,
    handleRegionChange,

    searchTerm,
    setSearchTerm: handleSearchChange, // Resets page to 1 on input

    selectedCustomers,
    handleSelectCustomer,
    handleSelectAll,
    isAllSelected,

    pageNumber,
    setPageNumber,

    pageSize,
    handlePageSizeChange,

    totalRecords, // Reflects the count of matching items across the whole list
    totalPages,   // Recalculated dynamically based on search matches

    loading,
    error,

    loadCustomers,
  };
};

export default useCustomers;