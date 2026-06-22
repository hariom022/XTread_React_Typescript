import { useEffect, useState } from "react";
import curingServiceApi from "../service/curingServiceApi";
import type { CuringRow } from "../type/curing.types";

const useCuringIndexTable = (status: number) => {
  const [curingRows, setCuringRows] = useState<CuringRow[]>([]);

  const loadData = async () => {
    try {
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
  };

  useEffect(() => {
    loadData();
  }, [status]);

  return {
    curingRows,
    setCuringRows,
    loadData,
  };
};

export default useCuringIndexTable;