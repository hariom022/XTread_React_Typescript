
import { useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  MaterialConsumptionAttemptPayload,
} from "../types/materialConsumptionAuditTrail.types";

const useMaterialConsumptionAttemptPayload = () => {
  const [payload, setPayload] =
    useState<MaterialConsumptionAttemptPayload | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttemptPayload = async (
    requestId: number,
    attemptId: number
  ) => {
    try {
      setLoading(true);
      setError("");
      setPayload(null);

      const response =
        await materialConsumptionAuditTrailService.getAttemptPayload(
          requestId,
          attemptId
        );

      if (response.data?.success && response.data?.data) {
        setPayload(response.data.data);
      } else {
        setError(
          response.data?.error?.message ||
            "Failed to load attempt payload."
        );
      }
    } catch (err: any) {
      console.error("Failed to load attempt payload:", err);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to load attempt payload."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAttemptPayload = () => {
    setPayload(null);
    setError("");
  };

  return {
    attemptPayload: payload,
    attemptPayloadLoading: loading,
    attemptPayloadError: error,
    fetchAttemptPayload,
    clearAttemptPayload,
  };
};

export default useMaterialConsumptionAttemptPayload;
