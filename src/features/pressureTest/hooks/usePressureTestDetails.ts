// src/features/pressureTest/hooks/usePressureTestDetails.ts

import { useEffect, useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";


export const usePressureTestDetails = (
  orderCasingId?: number
) => {
  const [details, setDetails] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const loadDetails = async () => {
    if (!orderCasingId) return;

    try {
      setLoading(true);

      const result =
        await indexPageApiService.getOrderCasingDetails(
          orderCasingId
        );

      setDetails(result.data);
    } catch (error) {
      console.error(
        "Failed to load casing details",
        error
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
    reload: loadDetails,
  };
};