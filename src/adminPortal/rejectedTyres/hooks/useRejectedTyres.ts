import { useCallback, useEffect, useState } from "react";
import rejectedTyreServiceApi from "../services/rejectedTyreServiceApi";
import type { RejectedTyre } from "../types/rejectedTyres.types";

const useRejectedTyres = () => {
  const [result, setResult] = useState<RejectedTyre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchRejectedTyres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await rejectedTyreServiceApi.getRejectedTyres({});

      setResult(response.data?.data ?? []);
    } catch (error) {
      console.error("Error fetching rejected tyres:", error);
      setError(error);
      setResult([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRejectedTyres();
  }, [fetchRejectedTyres]);

  return {
    result,
    loading,
    error,
    fetchRejectedTyres,
  };
};

export default useRejectedTyres;