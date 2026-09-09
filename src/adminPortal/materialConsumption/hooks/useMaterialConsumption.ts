import { useCallback, useEffect, useState } from "react";

import materialConsumptionApiService from "../services/materialConsumptionApiService";

import type {
  MaterialConsumption,
} from "../types/materialConsumption.type";

const useMaterialConsumption = () => {
  const [data, setData] = useState<MaterialConsumption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchMaterialConsumption = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await materialConsumptionApiService.getMaterialConsumptionApprovals();

        setData(response);
      } catch (err) {
        console.error(
          "Failed to fetch material consumption:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch Material Consumption."
        );

        setData([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMaterialConsumption();
  }, [fetchMaterialConsumption]);

  return {
    data,
    loading,
    error,
    refetch: fetchMaterialConsumption,
  };
};

export default useMaterialConsumption;