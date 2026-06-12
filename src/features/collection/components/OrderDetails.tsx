// src/features/collection/components/OrderDetails.tsx

import type { Category, ServiceType } from "../types/collection.types";

type Props = {
  // ================= ORDER =================
  orderNumber?: string;

  setOrderNumber?: (value: string) => void;

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
};

const OrderDetails = ({
  orderNumber = "",

  setOrderNumber,

  serviceTypes,

  selectedServiceType,

  handleServiceTypeChange,

  categories,

  category,

  handleCategoryChange,

  orderItemsLength = 0,
  isServiceLocked = false,
}: Props) => {
  return (
    <div className="card modern-card">
      {/* CARD HEADER */}
      <div className="card-header modern-header">Order Details</div>

      {/* CARD BODY */}
      <div className="card-body">
        {/* TOP ROW */}
        <div className="row mt-3">
          {/* BOOK NUMBER */}
          <div className="col-md-12">
            <label className="form-label">Book No#</label>

            <input
              className="form-control modern-input"
              placeholder="Collection Book No#"
              value={orderNumber}
              onChange={(e) => setOrderNumber?.(e.target.value)}
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
  );
};

export default OrderDetails;
