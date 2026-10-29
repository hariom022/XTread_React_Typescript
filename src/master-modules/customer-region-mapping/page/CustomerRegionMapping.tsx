
import { useEffect, useMemo, useState } from "react";
import { RingLoader } from "react-spinners";

import customerRegionMappingService from "../service/customerRegionMappingService";
import type {
  Customer,
  Region,
  CustomerRegionMapping,
} from "../types/customerRegionMapping.types";

import "../styles/CustomerRegionMapping.css";

const CustomerRegionMappingPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [mappings, setMappings] = useState<CustomerRegionMapping[]>([]);

  const [selectedCustomerNumber, setSelectedCustomerNumber] =
    useState("");

  const [selectedRegionIds, setSelectedRegionIds] =
    useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCustomer = customers.find(
    (customer) =>
      customer.customerNumber === selectedCustomerNumber
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [customerResponse, regionResponse] =
          await Promise.all([
            customerRegionMappingService.getCustomers(),
            customerRegionMappingService.getRegions(),
          ]);

        setCustomers(customerResponse.data?.data ?? []);
        setRegions(regionResponse.data?.data ?? []);
      } catch (err) {
        console.error("Failed to load customer region mapping data:", err);
        setError("Failed to load customers and regions.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // GET the selected customer's existing region mapping.
  const loadCustomerMapping = async (customerNumber: string) => {
    if (!customerNumber) {
      setMappings([]);
      setSelectedRegionIds([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await customerRegionMappingService.getCustomerRegions(
          customerNumber
        );

      const data = response.data?.data;

      // Supports either an array of regions or an object
      // containing regions / regionIds.
      const mappedRegions: Region[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.regions)
          ? data.regions
          : [];

      const regionIds: number[] = Array.isArray(data?.regionIds)
        ? data.regionIds.map(Number)
        : mappedRegions.map((region) => Number(region.id));

      setSelectedRegionIds(regionIds);

      const customer = customers.find(
        (item) => item.customerNumber === customerNumber
      );

      setMappings(
        regionIds.map((id) => {
          const region = regions.find((item) => item.id === id);

          return {
            customerNumber,
            customerName: customer?.customerName ?? customerNumber,
            regions: region
              ? [region]
              : mappedRegions.filter((item) => item.id === id),
          };
        }).filter((item) => item.regions.length > 0)
      );
    } catch (err) {
      console.error("Failed to load customer region mapping:", err);
      setError("Failed to load this customer's region mapping.");
      setMappings([]);
      setSelectedRegionIds([]);
    } finally {
      setLoading(false);
    }
  };

  // Rebuild the displayed mapping after customers and regions load.
  useEffect(() => {
    if (selectedCustomerNumber && customers.length && regions.length) {
      void loadCustomerMapping(selectedCustomerNumber);
    }
    // Intentionally load when the customer selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerNumber, customers, regions]);

  const handleCustomerChange = (
    customerNumber: string
  ) => {
    setSelectedCustomerNumber(customerNumber);
    setSelectedRegionIds([]);
    setMappings([]);
    setError("");
  };

  const handleRegionToggle = (regionId: number) => {
    setSelectedRegionIds((previous) =>
      previous.includes(regionId)
        ? previous.filter((id) => id !== regionId)
        : [...previous, regionId]
    );
  };

  const handleReset = () => {
    setSelectedCustomerNumber("");
    setSelectedRegionIds([]);
    setMappings([]);
    setSearch("");
    setError("");
  };

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

      await customerRegionMappingService.saveCustomerRegions(
        selectedCustomerNumber,
        selectedRegionIds
      );

      alert("Customer region mapping saved successfully.");

      await loadCustomerMapping(selectedCustomerNumber);
    } catch (err: any) {
      console.error("Failed to save customer region mapping:", err);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to save customer region mapping."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return mappings;

    return mappings.filter(
      (mapping) =>
        mapping.customerName.toLowerCase().includes(query) ||
        mapping.customerNumber.toLowerCase().includes(query) ||
        mapping.regions.some((region) =>
          region.regionName.toLowerCase().includes(query)
        )
    );
  }, [mappings, search]);

  return (
    <div className="customer-region-page">
      {/* FORM CARD */}
      <div className="card mapping-form-card">
        <div className="card-header mapping-card-header">
          Customer Region Mapping
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <div className="row g-4">
            {/* CUSTOMER */}
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Customer</label>

              <select
                className="form-select mapping-input"
                value={selectedCustomerNumber}
                onChange={(e) =>
                  handleCustomerChange(e.target.value)
                }
                disabled={loading || saving}
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option
                    key={customer.customerNumber}
                    value={customer.customerNumber}
                  >
                    {customer.customerName} (
                    {customer.customerNumber})
                  </option>
                ))}
              </select>
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
                <span className="text-muted">
                  No regions available.
                </span>
              ) : (
                <div className="row g-3">
                  {regions.map((region) => (
                    <div
                      className="col-sm-6 col-md-4 col-lg-3"
                      key={region.id}
                    >
                      <label className="form-check region-option">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedRegionIds.includes(region.id)}
                          onChange={() =>
                            handleRegionToggle(region.id)
                          }
                          disabled={saving}
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
              {saving ? "Saving..." : "Save Mapping"}
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
              onChange={(e) => setSearch(e.target.value)}
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
              {!selectedCustomerNumber ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Select a customer above to view its region mappings.
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading mappings...
                  </td>
                </tr>
              ) : filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No region mappings found for this customer.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>1</td>
                  <td>{selectedCustomer?.customerName}</td>
                  <td>{selectedCustomerNumber}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {filteredMappings.flatMap((mapping) =>
                        mapping.regions.map((region) => (
                          <span
                            className="region-badge"
                            key={`${mapping.customerNumber}-${region.id}`}
                          >
                            {region.regionName}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td>{selectedRegionIds.length}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegionMappingPage;
