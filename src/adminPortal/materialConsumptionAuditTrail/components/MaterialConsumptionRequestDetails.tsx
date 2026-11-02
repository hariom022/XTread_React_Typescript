import type {
  MaterialConsumptionRequestDetails as RequestDetails,
  OriginalRequestPayload,
  MaterialConsumptionAttemptPayload,
} from "../types/materialConsumptionAuditTrail.types";
import SAPAttemptHistoryTable from "./SAPAttemptHistoryTable";
type Attempt = RequestDetails["attempts"][number];

type Props = {
  item: RequestDetails | null;
  loading: boolean;
  error: string;

  attempts: Attempt[];
  attemptsLoading: boolean;
  attemptsError: string;

  // Original request payload
  payload: OriginalRequestPayload | null;
  payloadLoading: boolean;
  payloadError: string;
  onLoadPayload: () => void;
  onClearPayload: () => void;

  // Individual attempt payload
  attemptPayload: MaterialConsumptionAttemptPayload | null;
  attemptPayloadLoading: boolean;
  attemptPayloadError: string;
  onLoadAttemptPayload: (attemptId: number) => void;
  onClearAttemptPayload: () => void;
};

// ================= DATE FORMAT =================

const formatDate = (date: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? "-" : parsedDate.toLocaleString();
};

// ================= STATUS FORMAT =================

const getStatusName = (status: number) => {
  const statusMap: Record<number, string> = {
    1: "Pending",
    2: "Processing",
    3: "Succeeded",
    4: "Retrying",
    5: "Failed",
    6: "DeadLettered",
    7: "Cancelled",
  };

  return statusMap[status] ?? "Unknown";
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "succeeded":
    case "success":
      return "audit-status-success";

    case "failed":
    case "http_error":
    case "business_error":
      return "audit-status-failed";

    case "pending":
    case "processing":
    case "retrying":
    case "sent":
      return "audit-status-pending";

    default:
      return "audit-status-default";
  }
};

const formatPayload = (payload: string) => {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
};

const formatPayload1 = (value: string | null) => {
  if (!value) return "No payload available.";

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

// ================= COMPONENT =================

const MaterialConsumptionRequestDetails = ({
  item,
  loading,
  error,
  attempts,
  attemptsLoading,
  attemptsError,
  payload,
  payloadLoading,
  payloadError,
  onLoadPayload,
  onClearPayload,

  attemptPayload,
  attemptPayloadLoading,
  attemptPayloadError,
  onLoadAttemptPayload,
  onClearAttemptPayload,
}: Props) => {
  return (
    <div className="card material-audit-list-card material-request-page-card">
      {/* ================= PAGE HEADER ================= */}

      <div className="material-audit-details-header">
        <div>
          <h5>Material Consumption Request</h5>

          <p>{item ? `Request ID: ${item.requestId}` : "Request details"}</p>
        </div>
      </div>

      <div className="material-audit-details-body">
        {/* ================= REQUEST DETAILS LOADING ================= */}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-2 text-muted">Loading request details...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : !item ? (
          <div className="text-center py-4">No request details available.</div>
        ) : (
          <>
            {/* ================= REQUEST INFORMATION ================= */}

            <h6 className="audit-section-title">Request Information</h6>

            <div className="row g-3">
              {[
                // ["Request ID", item.requestId],
                // ["Order Casing ID", item.orderCasingId],
                ["Finished Material", item.finishedMaterial],
                ["Status", getStatusName(item.status)],
                [
                  "Attempt Count",
                  `${item.attemptCount} / ${item.maxAutomaticAttempts}`,
                ],
                ["Response Status Code", item.responseStatusCode],
                ["Production Number", item.productionNumber],
                ["Material Document GI", item.materialDocumentGI],
                ["Material Document GR", item.materialDocumentGR],
                ["Reference 1", item.reference1],
                ["Idempotency Key", item.idempotencyKey],
                ["Next Attempt At", formatDate(item.nextAttemptAtUtc)],
                ["Created At", formatDate(item.createdAtUtc)],
                ["Updated At", formatDate(item.updatedAtUtc)],
              ].map(([label, value]) => (
                <div className="col-md-6" key={label}>
                  <div className="audit-detail-field">
                    <label>{label}</label>

                    <div>{value ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= ORIGINAL REQUEST PAYLOAD ================= */}

            <h6 className="audit-section-title mt-4">
              Original Request Payload
            </h6>

            <div className="audit-detail-field">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <label>Original SAP Request JSON</label>

                  <p className="text-muted mb-0">
                    View the original payload sent to SAP.
                  </p>
                </div>

                <div className="d-flex gap-2">
                  {payload && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={onClearPayload}
                    >
                      Clear Payload
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={onLoadPayload}
                    disabled={payloadLoading}
                  >
                    {payloadLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-code-slash me-1"></i>
                        View Original Request Payload
                      </>
                    )}
                  </button>
                </div>
              </div>

              {payloadError && (
                <div className="alert alert-danger mt-3 mb-0">
                  {payloadError}
                </div>
              )}

              {payload && (
                <div className="mt-3">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label>Request ID</label>
                      <div>{payload.requestId}</div>
                    </div>

                    <div className="col-md-6">
                      <label>Order Casing ID</label>
                      <div>{payload.orderCasingId}</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Request Payload JSON</strong>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          formatPayload(payload.requestPayload),
                        )
                      }
                    >
                      <i className="bi bi-clipboard me-1"></i>
                      Copy JSON
                    </button>
                  </div>

                  <pre className="material-request-payload">
                    {formatPayload(payload.requestPayload)}
                  </pre>
                </div>
              )}
            </div>
            {/* ================= CASING DETAILS ================= */}

            <h6 className="audit-section-title mt-4">Casing Details</h6>

            <div className="row g-3">
              {[
                ["Order Number", item.casing.orderNumber],
                ["Customer Name", item.casing.customerName],
                ["Customer Number", item.casing.customerNumber],
                ["Production Number", item.casing.productionNumber],
                ["Barcode Number", item.casing.barcodeNumber],
                ["Tyre Reference Number", item.casing.tyreReferenceNumber],
                ["Batch Number", item.casing.batchNumber],
                // ["Current Stage", item.casing.currentStage],
                // ["Current Stage Status", item.casing.currentStageStatus],
              ].map(([label, value]) => (
                <div className="col-md-6" key={label}>
                  <div className="audit-detail-field">
                    <label>{label}</label>

                    <div>{value ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= CONSUMED MATERIALS ================= */}

            <h6 className="audit-section-title mt-4">Consumed Materials</h6>

            <div className="table-responsive">
              <table className="table table-bordered material-request-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Description</th>
                    <th>Consumed Quantity</th>
                    <th>Unit</th>
                    <th>Approved</th>
                  </tr>
                </thead>

                <tbody>
                  {!item.casing.materials ||
                  item.casing.materials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-3">
                        No materials found.
                      </td>
                    </tr>
                  ) : (
                    item.casing.materials.map((material, index) => (
                      <tr key={material.id}>
                        <td>{index + 1}</td>

                        <td>{material.material}</td>

                        <td>{material.materialDescription ?? "-"}</td>

                        <td>{material.consumedQuantity}</td>

                        <td>{material.unitOfMeasure}</td>

                        <td>
                          <span
                            className={`audit-status-badge ${
                              material.isApproved
                                ? "audit-status-success"
                                : "audit-status-pending"
                            }`}
                          >
                            {material.isApproved ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= SAP ATTEMPT HISTORY ================= */}

            <SAPAttemptHistoryTable
              requestId={item.requestId}
              attempts={attempts}
              loading={attemptsLoading}
              error={attemptsError}
              attemptPayload={attemptPayload}
              attemptPayloadLoading={attemptPayloadLoading}
              attemptPayloadError={attemptPayloadError}
              onLoadAttemptPayload={onLoadAttemptPayload}
              onClearAttemptPayload={onClearAttemptPayload}
            />

        

            

            {/* ================= LAST ERROR MESSAGE ================= */}

            <div className="audit-error-section mt-4">
              <label>Last Error Message</label>

              <div className="audit-error-message">
                {item.lastErrorMessage || "No error message available."}
              </div>
            </div>

            {/* ================= ATTEMPT FAILURE DETAILS ================= */}

            {attempts.some((attempt) => attempt.failureMessage) && (
              <>
                <h6 className="audit-section-title mt-4">
                  Attempt Failure Details
                </h6>

                {attempts
                  .filter((attempt) => attempt.failureMessage)
                  .map((attempt) => (
                    <div
                      className="audit-error-message mb-2"
                      key={attempt.attemptId}
                    >
                      <strong>Attempt {attempt.attemptNumber}:</strong>

                      <div>{attempt.failureMessage}</div>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialConsumptionRequestDetails;
