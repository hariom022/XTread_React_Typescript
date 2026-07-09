import { useEffect, useState } from "react";
import curingServiceApi from "../service/curingServiceApi";
import type { CuringRow } from "../type/curing.types";

const useCuringIndexTable = (status: number) => {
  const [curingRows, setCuringRows] = useState<CuringRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const response =
        await curingServiceApi.getCuringByStatus(status);

      const stage = response.data.data?.[0];

      const rows =
        stage?.batches?.flatMap((batch: any) =>
          batch.casings.map((casing: any) => ({
            ...casing,
            batchNumber: batch.batchNumber,
          })),
        ) || [];

      setCuringRows(rows);
    } catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [status]);

  return {
    curingRows,
    setCuringRows,
    loadData,
    loading
  };
};

export default useCuringIndexTable;