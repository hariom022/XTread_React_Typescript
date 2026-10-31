
import { useEffect, useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  MaterialConsumptionRequestDetails,
} from "../types/materialConsumptionAuditTrail.types";

type Attempt = MaterialConsumptionRequestDetails["attempts"][number];

const useMaterialConsumptionRequestAttempts = (
  requestId: number | undefined
) => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) {
      setAttempts([]);
      setError("");
      return;
    }

    let isActive = true;

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError("");
        setAttempts([]);

        const response =
          await materialConsumptionAuditTrailService.getRequestAttempts(
            requestId
          );

        if (!isActive) return;

        if (response.data?.success) {
          setAttempts(response.data?.data ?? []);
        } else {
          setError(
            response.data?.error?.message ||
              "Failed to load SAP attempt history."
          );
        }
      } catch (err: any) {
        if (!isActive) return;

        console.error("Failed to load SAP attempt history:", err);

        setError(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Failed to load SAP attempt history."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchAttempts();

    return () => {
      isActive = false;
    };
  }, [requestId]);

  return {
    attempts,
    attemptsLoading: loading,
    attemptsError: error,
  };
};

export default useMaterialConsumptionRequestAttempts;
