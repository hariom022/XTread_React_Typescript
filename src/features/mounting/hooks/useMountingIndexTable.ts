import {
  useEffect,
  useState,
} from "react";

import mountingServiceApi from "../service/mountingServiceApi";
import type { MountingRow } from "../types/mounting.type";
const useMountingIndexTable =
  () => {
    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      mountingRows,
      setMountingRows,
    ] = useState<
      MountingRow[]
    >([]);

    const fetchMountingOrders =
      async () => {
        try {
          setLoading(true);

          const response =
            await mountingServiceApi.getMountingOrdersLoaded();

          const stage =
            response.data.data?.[0];

          const rows =
            stage?.batches?.flatMap(
              (
                batch: any,
              ) =>
                batch.casings.map(
                  (
                    casing: any,
                  ) => ({
                    ...casing,

                    batchNumber:
                      batch.batchNumber,
                  }),
                ),
            ) || [];
console.log(
  "Rows",
  rows
);
console.log("First Row", rows[0]);
          setMountingRows(
            rows,
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      fetchMountingOrders();
    }, []);

    return {
       loading,

      mountingRows,
      setMountingRows,

      fetchMountingOrders,
    };
  };

export default useMountingIndexTable;