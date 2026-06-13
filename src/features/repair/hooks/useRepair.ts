import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type { RepairRow } from "../type/repair.types";

export const useRepair = () => {
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [repairs, setRepairs] = useState<RepairRow[]>([]);

  const transformApiData = (stages: any[]) => {
    const transformed: any[] = [];

    (stages || []).forEach((stage: any) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          console.log("CASING", casing);
          transformed.push({
            id: casing.orderCasingId,

            casing: casing.productionNumber || casing.barcodeNumber || "-",

            date: casing.orderDate || "-",

            serial: casing.tyreReferenceNumber || "-",

            dot: casing.dotNumber || "-",

            patternName: casing?.patternName || "-",

            tyreSize: casing.tyreSizeLabel || "-",

            customerName: casing.customerName || "-",

            service: casing.serviceTypeName || "-",

            batchNo: batch.batchNumber || "-",

            currentStageStatus: casing.currentStageStatus,

            // modal data
            requestedPattern: casing.patternName || "-",

            isRetreaded: false,

            previousPattern: "",

            previousRetreader: "",

            noOfRetread: 0,

            noOfExistingRepairs: 0,

            originalBatch: batch,

            originalCasing: casing,

            // batch summary
            approved: batch.stageSummary?.approved || 0,

            rejected: batch.stageSummary?.rejected || 0,

            pending: batch.stageSummary?.pending || 0,

            previousStage: batch.stageSummary?.stillAtPreviousStage || 0,

            expectedTotal:
              batch.stageSummary?.expectedTotal || batch.originalBatchSize,

            arrived: batch.stageSummary?.arrived || 0,
          });
        });
      });
    });

    return transformed;
  };

  const loadOrders = async () => {
    try {
      setLoading(true);

      const result = await indexPageApiService.getBatchProgress(10, 1);

      console.log("API Result:", result);

      const transformed = transformApiData(result.data.data);

      console.log("Transformed:", transformed);

      setRepairs(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOrders();
  }, []);

  // const filteredData = useMemo(() => {
  //   return repairs.filter((item) =>
  //     `${item.productionNumber}
  //      ${item.tyreReferenceNumber}
  //      ${item.patternName}`
  //       .toLowerCase()
  //       .includes(search.toLowerCase())
  //   );
  // }, [repairs, search]);

  const filteredData = useMemo(() => {
    return repairs.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, repairs]);

  return {
    loading,

    search,
    setSearch,

    repairs,

    filteredData,

     loadOrders,
  };
};
