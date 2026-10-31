import useMaterialConsumptionRequestAttempts from "../hooks/useMaterialConsumptionRequestAttempts";
import useMaterialConsumptionAttemptPayload from "../hooks/useMaterialConsumptionAttemptPayload";

import SAPAttemptHistoryTable from "./SAPAttemptHistoryTable";

type Props = {
  requestId: number;
};

const MaterialConsumptionAuditTrailAttemptRow = ({
  requestId,
}: Props) => {
  const {
    attempts,
    attemptsLoading,
    attemptsError,
  } = useMaterialConsumptionRequestAttempts(requestId);

  const {
    attemptPayload,
    attemptPayloadLoading,
    attemptPayloadError,
    fetchAttemptPayload,
    clearAttemptPayload,
  } = useMaterialConsumptionAttemptPayload();

  return (
    <div className="p-2">
      <SAPAttemptHistoryTable
        requestId={requestId}
        attempts={attempts}
        loading={attemptsLoading}
        error={attemptsError}
        attemptPayload={attemptPayload}
        attemptPayloadLoading={attemptPayloadLoading}
        attemptPayloadError={attemptPayloadError}
        onLoadAttemptPayload={(attemptId) =>
          fetchAttemptPayload(requestId, attemptId)
        }
        onClearAttemptPayload={clearAttemptPayload}
      />
    </div>
  );
};

export default MaterialConsumptionAuditTrailAttemptRow;