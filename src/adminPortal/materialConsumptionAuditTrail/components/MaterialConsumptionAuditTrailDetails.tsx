
import type {
  MaterialConsumptionAuditTrailItem,
} from "../types/materialConsumptionAuditTrail.types";

type Props = {
  item: MaterialConsumptionAuditTrailItem | null;
  onClose: () => void;
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "-"
    : parsedDate.toLocaleString();
};

const MaterialConsumptionAuditTrailDetails = ({
  item,
  onClose,
}: Props) => {
  if (!item) return null;

  const details = [
    ["Request ID", item.requestId],
    ["Order Casing ID", item.orderCasingId],
    ["Order Number", item.orderNumber],
    ["Customer Name", item.customerName],
    ["Customer Number", item.customerNumber],
    ["Production Number", item.productionNumber],
    ["Tyre Reference Number", item.tyreReferenceNumber],
    ["Barcode Number", item.barcodeNumber],
    ["Batch Number", item.batchNumber],
    ["Finished Material", item.finishedMaterial],
    ["Current Stage", item.currentStage],
    ["Current Stage Status", item.currentStageStatus],
    [
      "Material Consumption Approved",
      item.materialConsumptionApproved ? "Yes" : "No",
    ],
    ["Status", item.statusName],
    ["Attempt Count", `${item.attemptCount} / ${item.maxAutomaticAttempts}`],
    ["Last Attempt Status", item.lastAttemptStatus],
    ["Last Response Status Code", item.lastResponseStatusCode ?? "-"],
    ["Last Attempt Succeeded", item.lastAttemptSucceeded ? "Yes" : "No"],
    ["Retryable", item.isRetryable ? "Yes" : "No"],
    ["Can Manual Retry", item.canManualRetry ? "Yes" : "No"],
    ["Last Attempt At", formatDate(item.lastAttemptAtUtc)],
    ["Next Attempt At", formatDate(item.nextAttemptAtUtc)],
    ["Created At", formatDate(item.createdAtUtc)],
    ["Updated At", formatDate(item.updatedAtUtc)],
  ];

  return (
    <>
      <div className="material-audit-modal-backdrop" onClick={onClose}>
        <div
          className="material-audit-details-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="material-audit-details-header">
            <div>
              <h5>Material Consumption Request Details</h5>
              <p>Request ID: {item.requestId}</p>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="material-audit-details-body">
            <div className="row g-3">
              {details.map(([label, value]) => (
                <div className="col-md-6" key={label}>
                  <div className="audit-detail-field">
                    <label>{label}</label>
                    <div>{value ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="audit-error-section mt-4">
              <label>Last Error Message</label>

              <div className="audit-error-message">
                {item.lastErrorMessage || "No error message available."}
              </div>
            </div>
          </div>

          <div className="material-audit-details-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialConsumptionAuditTrailDetails;
