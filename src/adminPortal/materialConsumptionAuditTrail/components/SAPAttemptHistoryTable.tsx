import { useState } from "react";

import type {
  MaterialConsumptionRequestDetails,
  MaterialConsumptionAttemptPayload,
} from "../types/materialConsumptionAuditTrail.types";

type Attempt =
  MaterialConsumptionRequestDetails["attempts"][number];

type Props = {
  requestId: number;
  attempts: Attempt[];
  loading: boolean;
  error: string;

  attemptPayload: MaterialConsumptionAttemptPayload | null;
  attemptPayloadLoading: boolean;
  attemptPayloadError: string;

  onLoadAttemptPayload: (attemptId: number) => void;
  onClearAttemptPayload: () => void;
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "-"
    : parsedDate.toLocaleString();
};

const formatPayload = (value: string | null) => {
  if (!value) return "No payload available.";

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const SAPAttemptHistoryTable = ({
  requestId,
  attempts,
  loading,
  error,
  attemptPayload,
  attemptPayloadLoading,
  attemptPayloadError,
  onLoadAttemptPayload,
  onClearAttemptPayload,
}: Props) => {
  const [selectedAttemptId, setSelectedAttemptId] =
    useState<number | null>(null);

  const visiblePayload =
    attemptPayload?.requestId === requestId &&
    attemptPayload?.attemptId === selectedAttemptId
      ? attemptPayload
      : null;

  const handleViewPayload = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    onClearAttemptPayload();
    onLoadAttemptPayload(attemptId);
  };

  const handleClosePayload = () => {
    setSelectedAttemptId(null);
    onClearAttemptPayload();
  };

  return (
    <div className="sap-attempt-history">
      <h6 className="audit-section-title mt-3">
        SAP Attempt History
      </h6>

      <div className="table-responsive">
        <table className="table table-bordered material-request-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Attempt ID</th>
              <th>Attempt Number</th>
              <th>Request Sent At</th>
              <th>Response Code</th>
              <th>Duration (ms)</th>
              <th>Status</th>
              <th>Success</th>
              <th>Payload</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Loading SAP attempt history...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center text-danger py-4">
                  {error}
                </td>
              </tr>
            ) : attempts.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No attempt history found.
                </td>
              </tr>
            ) : (
              attempts.map((attempt, index) => (
                <tr key={attempt.attemptId}>
                  <td>{index + 1}</td>
                  <td>{attempt.attemptId}</td>
                  <td>{attempt.attemptNumber}</td>
                  <td>{formatDate(attempt.requestSentAtUtc)}</td>
                  <td>{attempt.responseStatusCode ?? "-"}</td>
                  <td>{attempt.durationMs ?? "-"}</td>
                  <td>{attempt.status || "-"}</td>

                  <td>
                    <span
                      className={`audit-status-badge ${
                        attempt.isSuccess
                          ? "audit-status-success"
                          : "audit-status-failed"
                      }`}
                    >
                      {attempt.isSuccess ? "Yes" : "No"}
                    </span>
                  </td>

                  <td>
                    {attempt.hasRequestPayload ||
                    attempt.hasResponsePayload ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleViewPayload(attempt.attemptId)
                        }
                        disabled={attemptPayloadLoading}
                      >
                        {attemptPayloadLoading &&
                        selectedAttemptId === attempt.attemptId ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-eye me-1"></i>
                            View Payload
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-muted">No payload</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {attemptPayloadError && (
        <div className="alert alert-danger mt-3">
          {attemptPayloadError}
        </div>
      )}

      {visiblePayload && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h6 className="audit-section-title mb-0">
              Attempt Payload Details
            </h6>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClosePayload}
            >
              <i className="bi bi-x-circle me-1"></i>
              Close Payload
            </button>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="audit-detail-field">
                <label>Request ID</label>
                <div>{visiblePayload.requestId}</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="audit-detail-field">
                <label>Attempt ID</label>
                <div>{visiblePayload.attemptId}</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="audit-detail-field">
                <label>Attempt Number</label>
                <div>{visiblePayload.attemptNumber}</div>
              </div>
            </div>
          </div>

          <h6 className="mt-4 mb-2">Request Payload</h6>

          <pre className="material-request-payload">
            {formatPayload(visiblePayload.requestPayload)}
          </pre>

          <h6 className="mt-4 mb-2">Response Payload</h6>

          <pre className="material-request-payload">
            {formatPayload(visiblePayload.responsePayload)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SAPAttemptHistoryTable;