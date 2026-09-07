// import { useEffect, useMemo, useState } from "react";
// import holdTyreServiceApi from "../service/holdTyreServiceApi";

// export const useHoldTyreIndexPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [holdTyres, setHoldTyres] = useState<any[]>([]);

//   const transformApiData = (stages: any[]) => {
//     const transformed: any[] = [];

//     (stages || []).forEach((stage: any) => {
//       stage.batches?.forEach((batch: any) => {
//         batch.casings?.forEach((casing: any) => {
//           transformed.push({
//             id: casing.orderCasingId,

//             casing:
//               casing.productionNumber ||
//               casing.barcodeNumber ||
//               "-",

//             date: casing.orderDate || "-",

//             serial: casing.tyreReferenceNumber || "-",

//             dot: casing.dotNumber || "-",

//             patternName: casing.patternName || "-",

//             tyreMakeName: casing.tyreMakeName || "-",

//             tyreSize: casing.tyreSizeLabel || "-",

//             customerName: casing.customerName || "-",

//             service: casing.serviceTypeName || "-",

//             batchNo: batch.batchNumber || "-",

//             currentStageStatus: casing.currentStageStatus,

//             requestedPattern: casing.patternName || "-",

//             originalBatch: batch,
//             originalCasing: casing,

//             approved: batch.stageSummary?.approved || 0,

//             rejected: batch.stageSummary?.rejected || 0,

//             pending: batch.stageSummary?.pending || 0,

//             previousStage: batch.stageSummary?.stillAtPreviousStage || 0,

//             expectedTotal:
//               batch.stageSummary?.expectedTotal ||
//               batch.originalBatchSize,

//             arrived: batch.stageSummary?.arrived || 0,
//           });
//         });
//       });
//     });

//     return transformed;
//   };

//   const loadHoldTyres = async () => {
//     try {
//       setLoading(true);

//       const result =
//         await holdTyreServiceApi.getHoldTyres();

//       console.log("HOLD API RESULT:", result);

//       const transformed =
//         transformApiData(result.data.data);

//       console.log("HOLD TRANSFORMED DATA:", transformed);

//       setHoldTyres(transformed);
//     } catch (error) {
//       console.error("Failed to load hold tyres:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHoldTyres();
//   }, []);

//   const filteredHoldTyres = useMemo(() => {
//     return holdTyres.filter((item) =>
//       `${item.casing}
//        ${item.serial}
//        ${item.patternName}
//        ${item.customerName}
//        ${item.batchNo}`
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   }, [search, holdTyres]);

//   return {
//     loading,

//     search,
//     setSearch,

//     holdTyres,
//     filteredHoldTyres,

//     loadHoldTyres,
//   };
// };
import { useEffect, useMemo, useState } from "react";

export const useHoldTyreIndexPage = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [holdTyres, setHoldTyres] = useState<any[]>([]);

  // TEMPORARY DUMMY DATA
  const dummyHoldTyres = [
    {
      id: 101,
      casing: "PRD-10001",
      date: "26-08-2026",
      serial: "TR-10001",
      dot: "2526",
      patternName: "Pattern A",
      tyreMakeName: "Michelin",
      tyreSize: "11R22.5",
      customerName: "ABC Transport",
      service: "Retread",
      batchNo: "BATCH-001",
      currentStageStatus: 3,
      requestedPattern: "Pattern A",
    },
    {
      id: 102,
      casing: "PRD-10002",
      date: "26-08-2026",
      serial: "TR-10002",
      dot: "2626",
      patternName: "Pattern B",
      tyreMakeName: "CEAT",
      tyreSize: "10.00R20",
      customerName: "XYZ Logistics",
      service: "Retread",
      batchNo: "BATCH-002",
      currentStageStatus: 3,
      requestedPattern: "Pattern B",
    },
    {
      id: 103,
      casing: "PRD-10003",
      date: "26-08-2026",
      serial: "TR-10003",
      dot: "2526",
      patternName: "Pattern C",
      tyreMakeName: "Bridgestone",
      tyreSize: "295/80R22.5",
      customerName: "Demo Customer",
      service: "Retread",
      batchNo: "BATCH-003",
      currentStageStatus: 3,
      requestedPattern: "Pattern C",
    },
  ];

  const loadHoldTyres = async () => {
    try {
      setLoading(true);

      // TEMPORARY
      // API is not ready yet.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setHoldTyres(dummyHoldTyres);

    } catch (error) {
      console.error("Failed to load hold tyres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldTyres();
  }, []);

  const filteredHoldTyres = useMemo(() => {
    return holdTyres.filter((item) =>
      `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.customerName}
       ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, holdTyres]);

  return {
    loading,
    search,
    setSearch,

    holdTyres,
    filteredHoldTyres,

    loadHoldTyres,
  };
};