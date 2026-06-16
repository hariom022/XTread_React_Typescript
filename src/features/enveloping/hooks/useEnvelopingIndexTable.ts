import {
  useEffect,
  useState,
} from "react";

import envelopingServiceApi from "../services/envelopingServiceApi";

import type { EnvelopingRow } from "../type/enveloping.type";

const useEnvelopingIndexTable =
  () => {
    // const [
    //   loading,
    //   setLoading,
    // ] = useState(false);

    const [
      envelopingRows,
      setEnvelopingRows,
    ] = useState<
      EnvelopingRow[]
    >([]);

    // const fetchEnvelopingOrders =
    //   async () => {
    //     try {
    //       setLoading(true);

    //       const response =
    //         await envelopingServiceApi.getEnvelopingOrders();

    //       const stage =
    //         response.data.data?.[0];

    //       const rows =
    //         stage?.batches?.flatMap(
    //           (
    //             batch: any,
    //           ) =>
    //             batch.casings.map(
    //               (
    //                 casing: any,
    //               ) => ({
    //                 ...casing,

    //                 batchNumber:
    //                   batch.batchNumber,
    //               }),
    //             ),
    //         ) || [];

    //       setEnvelopingRows(
    //         rows,
    //       );
    //     } catch (error) {
    //       console.error(error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    // useEffect(() => {
    //   fetchEnvelopingOrders();
    // }, []);

    return {
      // loading,

      envelopingRows,
      setEnvelopingRows,

      // fetchEnvelopingOrders,
    };
  };

export default useEnvelopingIndexTable;