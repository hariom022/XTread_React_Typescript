// src/features/collection/components/OrderDetails.tsx

import { useEffect, useState } from "react";
import customerService from "../services/customerService";
import type { Category, ServiceType, Zone } from "../types/collection.types";

type AccessibleRegion = {
  regionId: number;
  regionName: string;
  regionInitial: string;
  zones: Zone[];
};

type Props = {
  // ================= ORDER =================
  // orderNumber?: string;

  // setOrderNumber?: (value: string) => void;

  // ================= BOOK NUMBER =================
  bookNumber?: string;

  setBookNumber?: (value: string) => void;

  // ================= SERVICE =================
  serviceTypes: ServiceType[];

  selectedServiceType: string;

  handleServiceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  isServiceLocked?: boolean;

  // ================= CATEGORY =================
  categories: Category[];

  category: number;

  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  // ================= COMMON =================
  orderItemsLength?: number;
  isOrderLocked?: boolean;
  // DELIVERY REGION & ZONE
  deliveryRegionId: string;
  setDeliveryRegionId: (id: string) => void;
  deliveryZoneId: string;
  setDeliveryZoneId: (id: string) => void;
};

const OrderDetails = ({
  // orderNumber = "",

  // setOrderNumber,

  bookNumber = "",

  setBookNumber,
  serviceTypes,

  selectedServiceType,

  handleServiceTypeChange,

  categories,

  category,

  handleCategoryChange,

  orderItemsLength = 0,
  isServiceLocked = false,
  isOrderLocked = false,
  deliveryRegionId,
  setDeliveryRegionId,
  deliveryZoneId,
  setDeliveryZoneId,
}: Props) => {
  const [deliveryRegions, setDeliveryRegions] = useState<AccessibleRegion[]>(
    [],
  );
  const [deliveryZones, setDeliveryZones] = useState<Zone[]>([]);
  const [loadingDeliveryRegions, setLoadingDeliveryRegions] = useState(false);
  const [loadingDeliveryZones, setLoadingDeliveryZones] = useState(false);

  // Load accessible delivery regions.
  useEffect(() => {
    const loadDeliveryRegions = async () => {
      try {
        setLoadingDeliveryRegions(true);

        const response = await customerService.getAccessibleRegions();

        setDeliveryRegions(response.data?.data ?? []);
      } catch (error) {
        console.error("Failed to load delivery regions:", error);
        setDeliveryRegions([]);
      } finally {
        setLoadingDeliveryRegions(false);
      }
    };

    loadDeliveryRegions();
  }, []);

  // Load delivery zones whenever the delivery region changes.
  useEffect(() => {
    setDeliveryZones([]);
    setDeliveryZoneId("");

    if (!deliveryRegionId) {
      return;
    }

    let cancelled = false;

    const loadDeliveryZones = async () => {
      try {
        setLoadingDeliveryZones(true);

        const response = await customerService.getAccessibleZones(
          Number(deliveryRegionId),
        );

        if (cancelled) return;

        const regions: AccessibleRegion[] = response.data?.data ?? [];

        const selectedRegion = regions.find(
          (region) => Number(region.regionId) === Number(deliveryRegionId),
        );

        setDeliveryZones(selectedRegion?.zones ?? []);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load delivery zones:", error);
          setDeliveryZones([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDeliveryZones(false);
        }
      }
    };

    loadDeliveryZones();

    return () => {
      cancelled = true;
    };
  }, [deliveryRegionId, setDeliveryZoneId]);

  return (
    <>
      <div className="card modern-card">
        {/* CARD HEADER */}
        <div className="card-header modern-header">Order Details</div>

        {/* CARD BODY */}
        <div className="card-body">
          {/* TOP ROW */}
          <div className="row mt-3">
            {/* BOOK NUMBER */}
            <div className="col-md-12">
              <label className="form-label">Book Number</label>

              <input
                className="form-control modern-input"
                placeholder="Collection Book No#"
                value={bookNumber}
                onChange={(e) => setBookNumber?.(e.target.value)}
              />
            </div>
          </div>

          {/* SECOND ROW */}
          <div className="row g-3 mt-1">
            {/* SERVICE TYPE */}
            <div className="col-md-6">
              <label className="form-label">Service Type</label>

              <select
                className="form-select modern-input"
                value={selectedServiceType}
                onChange={handleServiceTypeChange}
                // disabled={orderItemsLength > 0}
                disabled={isServiceLocked}
                // disabled={isServiceLocked}
              >
                <option value="">-- Select Service Type --</option>

                {serviceTypes.map((service) => (
                  <option
                    key={service.serviceTypeId}
                    value={service.serviceTypeId}
                  >
                    {service.serviceTypeName}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div className="col-md-6">
              <label className="form-label">Category</label>

              <select
                className="form-select modern-input"
                value={category}
                onChange={handleCategoryChange}
                disabled={!selectedServiceType}
              >
                <option value="">-- Select Category --</option>

                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="card modern-card mt-3">
        <div className="card-header modern-header">Delivery Region & Zone</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Delivery Region</label>

              <select
                className="form-select modern-input"
                value={deliveryRegionId}
                onChange={(e) => setDeliveryRegionId(e.target.value)}
                disabled={loadingDeliveryRegions}
              >
                <option value="">
                  {loadingDeliveryRegions
                    ? "Loading regions..."
                    : "-- Select Delivery Region --"}
                </option>

                {deliveryRegions.map((region) => (
                  <option key={region.regionId} value={region.regionId}>
                    {region.regionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Delivery Zone</label>

              <select
                className="form-select modern-input"
                value={deliveryZoneId}
                onChange={(e) => setDeliveryZoneId(e.target.value)}
                disabled={!deliveryRegionId || loadingDeliveryZones}
              >
                <option value="">
                  {loadingDeliveryZones
                    ? "Loading zones..."
                    : "-- Select Delivery Zone --"}
                </option>

                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zoneName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
