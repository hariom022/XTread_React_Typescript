import { useState } from "react";

import useMaterialConsumptionAuditTrail from "../hooks/useMaterialConsumptionAuditTrail";

import MaterialConsumptionAuditTrailTable from "../components/MaterialConsumptionAuditTrailTable";

import MaterialConsumptionAuditTrailDetails from "../components/MaterialConsumptionAuditTrailDetails";
// import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

// import MaterialConsumptionRequestDetails from "../components/MaterialConsumptionRequestDetails";

// import type { MaterialConsumptionRequestDetails as RequestDetailsType } from "../types/materialConsumptionAuditTrail.types";

import type { MaterialConsumptionAuditTrailItem } from "../types/materialConsumptionAuditTrail.types";
import { useNavigate } from "react-router-dom";
import "../style/MaterialConsumptionAuditTrail.css";

const MaterialConsumptionAuditTrailIndex = () => {
  const {
    items,
    pagination,
    currentPage,
    pageSize,
    filters,
    loading,
    error,
    handleFilterChange,
    clearFilters,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  } = useMaterialConsumptionAuditTrail();

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<MaterialConsumptionAuditTrailItem | null>(null);

  const navigate = useNavigate();

  const handleViewRequest = (requestId: number) => {
    navigate(`/material-consumption-audit-trail/requests/${requestId}`);
  };
  return (
    <div className="material-consumption-audit-page">
      <div className="material-audit-page-header">
        <div>
          <h2>Material Consumption Audit Trail</h2>
          <p>Track material consumption requests and SAP integration status.</p>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={refresh}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card p-3 mb-3">
        {/* Filter Header */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setIsFilterExpanded((prev) => !prev)}
        >
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h5>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterExpanded((prev) => !prev);
            }}
          >
            <i
              className={`bi ${
                isFilterExpanded ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
            {isFilterExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        {/* Filter Fields */}
        {isFilterExpanded && (
          <div className="row g-3 mt-2">
            {/* Search */}
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                value={filters.Search}
                onChange={(e) => handleFilterChange("Search", e.target.value)}
                placeholder="Search requests..."
              />
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.Status}
                onChange={(e) => handleFilterChange("Status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="1">Pending</option>
                <option value="2">Processing</option>
                <option value="3">Succeeded</option>
                <option value="4">Retrying</option>
                <option value="5">Failed</option>
                <option value="6">DeadLettered</option>
                <option value="7">Cancelled</option>
              </select>
            </div>

            {/* Customer Number */}
            <div className="col-md-4">
              <label className="form-label">Customer Number</label>
              <input
                className="form-control"
                value={filters.CustomerNumber}
                onChange={(e) =>
                  handleFilterChange("CustomerNumber", e.target.value)
                }
              />
            </div>

            {/* Order Number */}
            <div className="col-md-4">
              <label className="form-label">Order Number</label>
              <input
                className="form-control"
                value={filters.OrderNumber}
                onChange={(e) =>
                  handleFilterChange("OrderNumber", e.target.value)
                }
              />
            </div>

            {/* Customer Name */}
            <div className="col-md-4">
              <label className="form-label">Customer Name</label>
              <input
                className="form-control"
                value={filters.CustomerName}
                onChange={(e) =>
                  handleFilterChange("CustomerName", e.target.value)
                }
              />
            </div>

            {/* Production Number */}
            <div className="col-md-4">
              <label className="form-label">Production Number</label>
              <input
                className="form-control"
                value={filters.ProductionNumber}
                onChange={(e) =>
                  handleFilterChange("ProductionNumber", e.target.value)
                }
              />
            </div>

            {/* Buttons */}
            <div className="col-12 d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={refresh}
                disabled={loading}
              >
                Apply / Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      <MaterialConsumptionAuditTrailTable
        items={items}
        pagination={pagination}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={loading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={setSelectedItem}
        onRequest={handleViewRequest}
      />

      <MaterialConsumptionAuditTrailDetails
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default MaterialConsumptionAuditTrailIndex;
