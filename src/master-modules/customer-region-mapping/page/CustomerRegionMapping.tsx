import { useEffect, useMemo, useRef, useState } from "react";

import customerRegionMappingService from "../service/customerRegionMappingService";
import type {
  Customer,
  Region,
  CustomerRegionMapping,
} from "../types/customerRegionMapping.types";

import "../styles/CustomerRegionMapping.css";

const CustomerRegionMappingPage = () => {
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [mappings, setMappings] = useState<CustomerRegionMapping[]>([]);
  const [allCustomerMappings, setAllCustomerMappings] = useState<
    CustomerRegionMapping[]
  >([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [selectedCustomerNumber, setSelectedCustomerNumber] = useState("");

  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);

  // Tracks whether the selected customer already has a region mapping.
  const [isExistingMapping, setIsExistingMapping] = useState(false);

  const [search, setSearch] = useState("");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCustomer = customers.find(
    (customer) => customer.customerNumber === selectedCustomerNumber,
  );

  // Load customers and regions.

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [customerResponse, regionResponse, mappingResponse] =
          await Promise.all([
            customerRegionMappingService.getCustomers(),
            customerRegionMappingService.getRegions(),
            customerRegionMappingService.getAllCustomerRegions(),
          ]);

        setCustomers(customerResponse.data?.data ?? []);
        setRegions(regionResponse.data?.data ?? []);

        setAllCustomerMappings(mappingResponse.data?.data ?? []);
      } catch (err) {
        console.error("Failed to load customer region mapping data:", err);
        setError("Failed to load customers and regions.");
      } finally {
        setLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  // Load the selected customer's existing region mapping.

  const loadCustomerMapping = (customerNumber: string) => {
    if (!customerNumber) {
      setMappings([]);
      setSelectedRegionIds([]);
      setIsExistingMapping(false);
      return;
    }

    const customerMapping = allCustomerMappings.find(
      (item) => item.customerNumber === customerNumber,
    );

    if (!customerMapping) {
      setMappings([]);
      setSelectedRegionIds([]);
      setIsExistingMapping(false);
      return;
    }

    const mappedRegions = customerMapping.regions ?? [];

    const regionIds = mappedRegions.map((region) => Number(region.id));

    setSelectedRegionIds(regionIds);
    setIsExistingMapping(regionIds.length > 0);

    setMappings([customerMapping]);
  };

  // Reload mapping when the customer selection changes and
  // the customer/region lists have loaded.

  useEffect(() => {
    if (
      selectedCustomerNumber &&
      allCustomerMappings.length >= 0 &&
      customers.length > 0 &&
      regions.length > 0
    ) {
      loadCustomerMapping(selectedCustomerNumber);
    } else if (!selectedCustomerNumber) {
      setMappings([]);
      setSelectedRegionIds([]);
      setIsExistingMapping(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerNumber, allCustomerMappings, customers, regions]);

  const handleCustomerChange = (customerNumber: string) => {
    setSelectedCustomerNumber(customerNumber);
    setSelectedRegionIds([]);
    setMappings([]);
    setIsExistingMapping(false);
    setError("");
  };

  const handleRegionToggle = (regionId: number) => {
    setSelectedRegionIds((previous) =>
      previous.includes(regionId)
        ? previous.filter((id) => id !== regionId)
        : [...previous, regionId],
    );
  };

  const handleReset = () => {
    setSelectedCustomerNumber("");
    setSelectedRegionIds([]);
    setMappings([]);
    setIsExistingMapping(false);
    setSearch("");
    setError("");
  };

  // POST for a new mapping; PUT for an existing mapping.
  const handleSave = async () => {
    if (!selectedCustomerNumber) {
      setError("Please select a customer.");
      return;
    }

    if (selectedRegionIds.length === 0) {
      setError("Please select at least one region.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isExistingMapping) {
        await customerRegionMappingService.updateCustomerRegions(
          selectedCustomerNumber,
          selectedRegionIds,
        );

        alert("Customer region mapping updated successfully.");
      } else {
        await customerRegionMappingService.saveCustomerRegions(
          selectedCustomerNumber,
          selectedRegionIds,
        );

        alert("Customer region mapping saved successfully.");
      }

      // Reload the saved mapping and update the existing-mapping state.

      const response =
        await customerRegionMappingService.getAllCustomerRegions();

      setAllCustomerMappings(response.data?.data ?? []);
    } catch (err: any) {
      console.error("Failed to save customer region mapping:", err);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to save customer region mapping.",
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return allCustomerMappings;
    }

    return allCustomerMappings.filter(
      (mapping) =>
        mapping.customerName.toLowerCase().includes(query) ||
        mapping.customerNumber.toLowerCase().includes(query) ||
        mapping.regions.some((region) =>
          region.regionName.toLowerCase().includes(query),
        ),
    );
  }, [allCustomerMappings, search]);

  const totalRecords = filteredMappings.length;

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedMappings = filteredMappings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(query) ||
        customer.customerNumber.toLowerCase().includes(query),
    );
  }, [customers, customerSearch]);

  const handleCustomerSelect = async (customer: Customer) => {
    const customerNumber = customer.customerNumber;
    const isSameCustomer = customerNumber === selectedCustomerNumber;

    setCustomerSearch(`${customer.customerName} (${customer.customerNumber})`);

    setIsCustomerDropdownOpen(false);
    setError("");

    if (isSameCustomer) {
      // Reload the existing mapping when the same customer is selected again.
      loadCustomerMapping(customerNumber);
      return;
    }

    handleCustomerChange(customerNumber);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="customer-region-page">
      {/* FORM CARD */}
      <div className="card mapping-form-card">
        <div className="card-header mapping-card-header">
          Customer Region Mapping
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="row g-4">
            {/* CUSTOMER */}

            {/* CUSTOMER SEARCHABLE DROPDOWN */}
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Customer</label>

              <div
                className="customer-search-dropdown"
                ref={customerDropdownRef}
              >
                <input
                  type="text"
                  className="form-control mapping-input"
                  placeholder="Search customer name or number..."
                  value={
                    isCustomerDropdownOpen
                      ? customerSearch
                      : selectedCustomer
                        ? `${selectedCustomer.customerName} (${selectedCustomer.customerNumber})`
                        : customerSearch
                  }
                  onFocus={() => {
                    setCustomerSearch("");
                    setIsCustomerDropdownOpen(true);
                  }}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setIsCustomerDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsCustomerDropdownOpen(false);
                      setCustomerSearch("");
                    }

                    if (e.key === "Enter" && filteredCustomers.length > 0) {
                      e.preventDefault();
                      handleCustomerSelect(filteredCustomers[0]);
                    }
                  }}
                  disabled={loading || saving}
                  autoComplete="off"
                />

                {isCustomerDropdownOpen && !loading && !saving && (
                  <div className="customer-dropdown-options">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <button
                          type="button"
                          className="customer-dropdown-option"
                          key={customer.customerNumber}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <span className="customer-dropdown-name">
                            {customer.customerName}
                          </span>

                          <small className="customer-dropdown-number">
                            {customer.customerNumber}
                          </small>
                        </button>
                      ))
                    ) : (
                      <div className="customer-dropdown-empty">
                        No customers found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CUSTOMER NUMBER */}
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Customer Number</label>

              <input
                className="form-control mapping-input"
                value={selectedCustomer?.customerNumber ?? ""}
                placeholder="Customer number"
                readOnly
              />
            </div>

            {/* CUSTOMER EMAIL */}
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Email</label>

              <input
                className="form-control mapping-input"
                value={selectedCustomer?.email ?? ""}
                placeholder="Customer email"
                readOnly
              />
            </div>
          </div>

          {/* REGION MULTI-SELECTION */}
          <div className="mt-4">
            <label className="form-label">Select Regions</label>

            <div className="region-selection-box">
              {!selectedCustomerNumber ? (
                <span className="text-muted">
                  Select a customer to manage its regions.
                </span>
              ) : regions.length === 0 ? (
                <span className="text-muted">No regions available.</span>
              ) : (
                <div className="row g-3">
                  {regions.map((region) => (
                    <div className="col-sm-6 col-md-4 col-lg-3" key={region.id}>
                      <label className="form-check region-option">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedRegionIds.includes(
                            Number(region.id),
                          )}
                          onChange={() => handleRegionToggle(Number(region.id))}
                          disabled={saving || loading}
                        />

                        <span className="form-check-label">
                          {region.regionName}
                          <small className="d-block text-muted">
                            {region.regionInitial}
                          </small>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <small className="text-muted">
              Selected regions: {selectedRegionIds.length}
            </small>
          </div>

          {/* BUTTONS */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-danger mapping-save-button"
              onClick={handleSave}
              disabled={
                loading ||
                saving ||
                !selectedCustomerNumber ||
                selectedRegionIds.length === 0
              }
            >
              {saving
                ? "Saving..."
                : isExistingMapping
                  ? "Update Mapping"
                  : "Save Mapping"}
            </button>
          </div>
        </div>
      </div>

      {/* MAPPING TABLE */}
      <div className="card mapping-list-card">
        <div className="mapping-list-toolbar">
          <div>
            <h3>Customer Region Mappings</h3>
            <p>Manage and view assigned customer regions</p>
          </div>

          <div className="mapping-search">
            <span className="mapping-search-icon">⌕</span>

            <input
              className="form-control"
              placeholder="Search mappings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table mapping-table mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Customer Number</th>
                <th>Mapped Regions</th>
                <th>Region Count</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading customer mappings...
                  </td>
                </tr>
              ) : filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No customer region mappings found.
                  </td>
                </tr>
              ) : (
                paginatedMappings.map((mapping, index) => (
                  <tr key={mapping.customerNumber}>
                    <td>{startIndex + index + 1}</td>

                    <td>{mapping.customerName}</td>

                    <td>{mapping.customerNumber}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {mapping.regions.map((region) => (
                          <span
                            className="region-badge"
                            key={`${mapping.customerNumber}-${region.id}`}
                          >
                            {region.regionName}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>{mapping.regions.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mapping-pagination">
          <div className="d-flex align-items-center gap-2">
            <span>Rows per page:</span>

            <select
              className="form-select form-select-sm"
              style={{ width: "75px" }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <span className="text-muted">
              {totalRecords === 0
                ? "Showing 0 records"
                : `Showing ${startIndex + 1} to ${Math.min(
                    startIndex + itemsPerPage,
                    totalRecords,
                  )} of ${totalRecords} records`}
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={`btn btn-sm ${
                    currentPage === page
                      ? "btn-danger"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegionMappingPage;
