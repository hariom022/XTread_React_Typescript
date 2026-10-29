
import { useEffect, useState } from "react";

import "../styles/Collection.css";
import customerService from "../services/customerService";

import type {
  Customer,
  Region,
  Zone,
  AccessibleZonesResponse,
} from "../types/collection.types";

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
}: Props) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  // const [selectedRegionId, setSelectedRegionId] =
  //   useState("");

  // const [selectedZoneId, setSelectedZoneId] =
  //   useState("");

  const [regionsLoading, setRegionsLoading] =
    useState(false);

  const [zonesLoading, setZonesLoading] =
    useState(false);

  const [regionError, setRegionError] =
    useState("");

  const [zoneError, setZoneError] =
    useState("");

  // Load regions whenever the selected customer changes.
  useEffect(() => {
    let cancelled = false;

    const loadRegions = async () => {
      // Clear the previous customer's Region and Zone.
      setRegions([]);
      setZones([]);
      setSelectedRegionId("");
      setSelectedZoneId("");
      setRegionError("");
      setZoneError("");

      if (!selectedCustomer?.customerNumber) {
        setRegionsLoading(false);
        return;
      }

      try {
        setRegionsLoading(true);

        const res = await customerService.getCustomerRegions(
          selectedCustomer.customerNumber
        );

        if (cancelled) return;

        const data: Region[] = res.data?.data ?? [];

        setRegions(data);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load regions:", error);
        setRegionError("Failed to load regions.");
      } finally {
        if (!cancelled) {
          setRegionsLoading(false);
        }
      }
    };

    loadRegions();

    return () => {
      cancelled = true;
    };
  }, [selectedCustomer?.customerNumber]);

  // Load zones whenever the selected Region changes.
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

        const res = await customerService.getAccessibleZones(
          Number(selectedRegionId)
        );

        if (cancelled) return;

        const data: AccessibleZonesResponse[] =
          res.data?.data ?? [];

        // The API returns zones inside each region object.
        const regionData = data.find(
          (region) =>
            region.regionId === Number(selectedRegionId)
        );

        setZones(regionData?.zones ?? []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load zones:", error);
        setZoneError("Failed to load zones.");
      } finally {
        if (!cancelled) {
          setZonesLoading(false);
        }
      }
    };

    loadZones();

    return () => {
      cancelled = true;
    };
  }, [selectedRegionId]);

  return (
    <div className="card modern-card">
      <div className="card-header modern-header">
        Customer Selection
      </div>

      <div className="card-body">
        {/* CUSTOMER NAME */}
        <label className="form-label">Customer Name</label>

        <select
          className="form-select modern-input mb-3"
          value={selectedCustomer?.customerNumber || ""}
          onChange={(e) => {
            const customer = customers.find(
              (c) => c.customerNumber === e.target.value
            );

            setSelectedCustomer(customer || null);
          }}
          disabled={orderItemsLength > 0 || disabled}
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option
              key={customer.customerNumber}
              value={customer.customerNumber}
            >
              {customer.customerName}
            </option>
          ))}
        </select>

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
              value={
                selectedCustomer?.salesGroupDescription || ""
              }
              readOnly
            />
          </div>
        </div>

        {/* REGION AND ZONE */}
        <div className="row mt-3">
          {/* REGION DROPDOWN */}
          <div className="col-md-6">
            <label className="form-label">Region</label>

            <select
              className="form-select modern-input"
              value={selectedRegionId}
              onChange={(e) =>
                setSelectedRegionId(e.target.value)
              }
              disabled={
                !selectedCustomer ||
                regionsLoading ||
                regions.length === 0
              }
            >
              <option value="">
                {regionsLoading
                  ? "Loading regions..."
                  : "Select Region"}
              </option>

              {regions.map((region) => (
                <option
                  key={region.id}
                  value={region.id}
                >
                  {region.regionName}
                </option>
              ))}
            </select>

            {regionError && (
              <small className="text-danger">
                {regionError}
              </small>
            )}
          </div>

          {/* ZONE DROPDOWN */}
          <div className="col-md-6">
            <label className="form-label">Zone</label>

            <select
              className="form-select modern-input"
              value={selectedZoneId}
              onChange={(e) =>
                setSelectedZoneId(e.target.value)
              }
              disabled={
                !selectedRegionId ||
                zonesLoading ||
                zones.length === 0
              }
            >
              <option value="">
                {zonesLoading
                  ? "Loading zones..."
                  : "Select Zone"}
              </option>

              {zones.map((zone) => (
                <option
                  key={zone.id}
                  value={zone.id}
                >
                  {zone.zoneName}
                </option>
              ))}
            </select>

            {zoneError && (
              <small className="text-danger">
                {zoneError}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelection;
