
import { useEffect, useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  MaterialConsumptionRequestDetails,
} from "../types/materialConsumptionAuditTrail.types";

const useMaterialConsumptionRequestDetails = (
  requestId: number | undefined
) => {
  const [data, setData] =
    useState<MaterialConsumptionRequestDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) {
      setData(null);
      setError("");
      return;
    }

    let isActive = true;

    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setData(null);

        const response =
          await materialConsumptionAuditTrailService.getRequestDetails(
            requestId
          );

        if (!isActive) return;

        if (response.data?.success && response.data?.data) {
          setData(response.data.data);
        } else {
          setError(
            "Failed to load material consumption request details."
          );
        }
      } catch (err: any) {
        if (!isActive) return;

        console.error(
          "Failed to load material consumption request details:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error?.message ||
            "Failed to load material consumption request details."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchRequestDetails();

    return () => {
      isActive = false;
    };
  }, [requestId]);

  return {
    data,
    loading,
    error,
  };
};

export default useMaterialConsumptionRequestDetails;
