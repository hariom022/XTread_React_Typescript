
import { useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  OriginalRequestPayload,
} from "../types/materialConsumptionAuditTrail.types";

const useMaterialConsumptionRequestPayload = () => {
  const [payload, setPayload] =
    useState<OriginalRequestPayload | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayload = async (requestId: number) => {
    try {
      setLoading(true);
      setError("");
      setPayload(null);

      const response =
        await materialConsumptionAuditTrailService
          .getOriginalRequestPayload(requestId);

      if (response.data?.success && response.data?.data) {
        setPayload(response.data.data);
      } else {
        setError(
          response.data?.error?.message ||
            "Failed to load original request payload."
        );
      }
    } catch (err: any) {
      console.error("Failed to load original request payload:", err);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load original request payload."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearPayload = () => {
    setPayload(null);
    setError("");
  };

  return {
    payload,
    loading,
    error,
    fetchPayload,
    clearPayload,
  };
};

export default useMaterialConsumptionRequestPayload;
