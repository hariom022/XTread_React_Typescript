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
    loading,
    error,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  } = useMaterialConsumptionAuditTrail();

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
