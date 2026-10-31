
import { useNavigate, useParams } from "react-router-dom";

import useMaterialConsumptionRequestDetails from "../hooks/useMaterialConsumptionRequestDetails";

import useMaterialConsumptionRequestAttempts from "../hooks/useMaterialConsumptionRequestAttempts";

import useMaterialConsumptionRequestPayload from "../hooks/useMaterialConsumptionRequestPayload";

import MaterialConsumptionRequestDetails from "../components/MaterialConsumptionRequestDetails";
import useMaterialConsumptionAttemptPayload from "../hooks/useMaterialConsumptionAttemptPayload";
import "../style/MaterialConsumptionAuditTrail.css";

const MaterialConsumptionRequestDetailsPage = () => {
  const { requestId } = useParams<{ requestId: string }>();

  const navigate = useNavigate();

  const parsedRequestId = Number(requestId);

  const validRequestId =
    Number.isInteger(parsedRequestId) && parsedRequestId > 0;

  // REQUEST DETAILS
  const {
    data,
    loading,
    error,
  } = useMaterialConsumptionRequestDetails(
    validRequestId ? parsedRequestId : undefined
  );

  // ATTEMPT HISTORY
  const {
    attempts,
    attemptsLoading,
    attemptsError,
  } = useMaterialConsumptionRequestAttempts(
    validRequestId ? parsedRequestId : undefined
  );

  // ORIGINAL REQUEST PAYLOAD
  const {
    payload,
    loading: payloadLoading,
    error: payloadError,
    fetchPayload,
    clearPayload,
  } = useMaterialConsumptionRequestPayload();

  // INDIVIDUAL ATTEMPT REQUEST/RESPONSE PAYLOAD
const {
  attemptPayload,
  attemptPayloadLoading,
  attemptPayloadError,
  fetchAttemptPayload,
  clearAttemptPayload,
} = useMaterialConsumptionAttemptPayload();

  return (
    <div className="material-consumption-audit-page">

      {/* PAGE HEADER */}
      <div className="material-audit-page-header">
        <div>
          <h2>Material Consumption Request Details</h2>

          <p>
            View request information, casing materials and SAP
            integration attempt history.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/material-consumption-audit-trail")
          }
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Audit Trail
        </button>
      </div>

      {!validRequestId ? (
        <div className="alert alert-danger">
          Invalid request ID.
        </div>
      ) : (
        <MaterialConsumptionRequestDetails
  item={data}
  loading={loading}
  error={error}
  attempts={attempts}
  attemptsLoading={attemptsLoading}
  attemptsError={attemptsError}

  // Original request payload
  payload={payload}
  payloadLoading={payloadLoading}
  payloadError={payloadError}
  onLoadPayload={() => fetchPayload(parsedRequestId)}
  onClearPayload={clearPayload}

  // Individual attempt payload
  attemptPayload={attemptPayload}
  attemptPayloadLoading={attemptPayloadLoading}
  attemptPayloadError={attemptPayloadError}
  onLoadAttemptPayload={(attemptId) =>
    fetchAttemptPayload(parsedRequestId, attemptId)
  }
  onClearAttemptPayload={clearAttemptPayload}
/>
      )}
    </div>
  );
};

export default MaterialConsumptionRequestDetailsPage;
