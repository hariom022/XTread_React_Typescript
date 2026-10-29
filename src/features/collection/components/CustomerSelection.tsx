import { useEffect, useState } from "react";

import "../styles/Collection.css";
import customerService from "../services/customerService";

import type { Customer, Zone } from "../types/collection.types";

type AccessibleRegion = {
  regionId: number;
  regionName: string;
  regionInitial: string;
  zones: Zone[];
};

type Props = {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  orderItemsLength?: number;
  disabled?: boolean;

  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  setDeliveryRegionId: (id: string) => void;
  setDeliveryZoneId: (id: string) => void;

  loading?: boolean;
customersError?: string;
};

const CustomerSelection = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  orderItemsLength = 0,
  disabled = false,
  selectedRegionId,
  setSelectedRegionId,
  selectedZoneId,
  setSelectedZoneId,
  setDeliveryRegionId,
  setDeliveryZoneId,
  loading = false,
customersError = "",
}: Props) => {
  const [regions, setRegions] = useState<AccessibleRegion[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [regionsLoading, setRegionsLoading] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(false);

  const [regionError, setRegionError] = useState("");
  const [zoneError, setZoneError] = useState("");

  // Load accessible regions when the component mounts.
  useEffect(() => {
    let cancelled = false;

    const loadRegions = async () => {
      setRegions([]);
      setRegionError("");

      try {
        setRegionsLoading(true);

        const response = await customerService.getAccessibleRegions();

        if (cancelled) return;

        const data: AccessibleRegion[] = response.data?.data ?? [];

        setRegions(data);

        if (data.length === 1) {
          const onlyRegionId = String(data[0].regionId);

          setSelectedRegionId(onlyRegionId);
          setDeliveryRegionId(onlyRegionId);
        } else if (
          selectedRegionId &&
          !data.some((region) => String(region.regionId) === selectedRegionId)
        ) {
          setSelectedRegionId("");
          setSelectedZoneId("");
          setDeliveryRegionId("");
          setDeliveryZoneId("");
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load accessible regions:", error);
        setRegionError("Failed to load regions.");
      } finally {
        if (!cancelled) {
          setRegionsLoading(false);
        }
      }
    };

    void loadRegions();

    return () => {
      cancelled = true;
    };
  }, [
    selectedRegionId,
    setSelectedRegionId,
    setSelectedZoneId,
    setDeliveryRegionId,
    setDeliveryZoneId,
  ]);

  // Load zones whenever the selected region changes.
  useEffect(() => {
    let cancelled = false;

    const loadZones = async () => {
      setZones([]);
      setSelectedZoneId("");
      setZoneError("");

      if (!selectedRegionId) {
        setZonesLoading(false);
        return;
      }

      try {
        setZonesLoading(true);

        const response = await customerService.getAccessibleZones(
          Number(selectedRegionId),
        );

        if (cancelled) return;

        const data: AccessibleRegion[] = response.data?.data ?? [];

        // Find the selected region in the API response.
        const selectedRegion = data.find(
          (region) => Number(region.regionId) === Number(selectedRegionId),
        );

        setZones(selectedRegion?.zones ?? []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load accessible zones:", error);
        setZoneError("Failed to load zones.");
      } finally {
        if (!cancelled) {
          setZonesLoading(false);
        }
      }
    };

    void loadZones();

    return () => {
      cancelled = true;
    };
  }, [selectedRegionId, setSelectedZoneId]);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = event.target.value;

    setSelectedRegionId(regionId);

    // Copy the main Region into Delivery Region.
    setDeliveryRegionId(regionId);

    // Reset both zone selections because the region changed.
    setSelectedZoneId("");
    setDeliveryZoneId("");

    setZones([]);
    setZoneError("");
  };

  return (
    <div className="card modern-card">
      <div className="card-header modern-header">Customer Selection</div>

      <div className="card-body">
        {/* REGION AND ZONE */}
        <div className="row mt-1 mb-2">
          {/* REGION DROPDOWN */}
          <div className="col-md-6">
            <label className="form-label">Region</label>

            <select
              className="form-select modern-input"
              value={selectedRegionId}
              onChange={handleRegionChange}
              disabled={regionsLoading || regions.length === 0}
            >
              <option value="">
                {regionsLoading ? "Loading regions..." : "Select Region"}
              </option>

              {regions.map((region) => (
                <option key={region.regionId} value={region.regionId}>
                  {region.regionName}
                </option>
              ))}
            </select>

            {regionError && (
              <small className="text-danger">{regionError}</small>
            )}
          </div>

          {/* ZONE DROPDOWN */}
          <div className="col-md-6">
            <label className="form-label">Zone</label>

            <select
              className="form-select modern-input"
              value={selectedZoneId}
              onChange={(event) => {
                const zoneId = event.target.value;

                setSelectedZoneId(zoneId);
                setDeliveryZoneId(zoneId);
              }}
              disabled={!selectedRegionId || zonesLoading || zones.length === 0}
            >
              <option value="">
                {zonesLoading ? "Loading zones..." : "Select Zone"}
              </option>

              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.zoneName}
                </option>
              ))}
            </select>

            {zoneError && <small className="text-danger">{zoneError}</small>}
          </div>
        </div>

        {/* CUSTOMER NAME */}
       <label className="form-label">Customer Name</label>

<select
  className="form-select modern-input mb-3"
  value={selectedCustomer?.customerNumber || ""}
  onChange={(event) => {
    const customer = customers.find(
      (item) => item.customerNumber === event.target.value,
    );

    setSelectedCustomer(customer || null);
  }}
  disabled={
    orderItemsLength > 0 ||
    disabled ||
    !selectedRegionId ||
    loading
  }
>
  <option value="">
    {!selectedRegionId
      ? "Select Region First"
      : loading
        ? "Loading customers..."
        : customers.length === 0
          ? "No customers found"
          : "Select Customer"}
  </option>

  {customers.map((customer) => (
    <option
      key={customer.customerNumber}
      value={customer.customerNumber}
    >
      {customer.customerName}
    </option>
  ))}
</select>

{customersError && (
  <small className="text-danger">{customersError}</small>
)}

        {/* CONTACT PERSON */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Contact Person"
          value={selectedCustomer?.customerName || ""}
          readOnly
        />

        {/* MOBILE */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Mobile"
          value={selectedCustomer?.mobileNumber || ""}
          readOnly
        />

        {/* EMAIL */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Email"
          value={selectedCustomer?.email || ""}
          readOnly
        />

        {/* ACCOUNT MANAGER */}
        <div className="row mt-3">
          <div className="col-md-6">
            <input
              className="form-control modern-input"
              placeholder="Account Manager"
              value={selectedCustomer?.salesGroupDescription || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelection;
