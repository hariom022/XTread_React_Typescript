// src/features/pressureTest/hooks/usePressureTestDetails.ts

import { useEffect, useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import { getPressureTestErrorMessage } from "../utils/getPressureTestErrorMessage";

export const usePressureTestDetails = (
  orderCasingId?: number
) => {
  const [details, setDetails] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const loadDetails = async () => {
    if (!orderCasingId) return;

    try {
      setLoading(true);

      const result =
        await indexPageApiService.getOrderCasingDetails(
          orderCasingId
        );
      console.log("Pressure Test API:", result.data);
      setDetails(result.data.data);
    } catch (error: unknown) {
      setDetailsError(
        getPressureTestErrorMessage(
          error,
          "Failed to load casing details.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [orderCasingId]);

  return {
    details,
    loading,
    detailsError,
    reload: loadDetails,
  };
};