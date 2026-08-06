import { useEffect, useState } from "react";

import qualityControlServiceApi from "../service/qualityControlServiceApi";

import type { QualityControlRow } from "../type/qualityControl.type";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const useQualityControlIndexTable = () => {
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<QualityControlRow[]>([]);

  const fetchRows = async () => {
    try {
      setLoading(true);

      const response = await indexPageApiService.getBatchProgress(15, 1);
      const stage = response.data.data?.[0];

      const data =
        stage?.batches?.flatMap((batch: any) =>
          batch.casings.map((casing: any) => ({
            ...casing,
            // id: casing.orderCasingId,

            // casing: casing.productionNumber || "-",
            // batchNumber:
            //     batch.batchNumber,
            id: casing.orderCasingId,

            casing: casing.productionNumber || "-",

            serial: casing.tyreReferenceNumber || "-",

            dot: casing.dotNumber || "-",

            tyreSize: casing.tyreSizeLabel || "-",

            patternName: casing.patternName || "-",
            tyreMakeName:casing.tyreMakeName || "-",

            requestedPattern: "-",

            date: casing.orderDate || "-",

            customerName: casing.customerName || "-",

            service: batch.batchNumber?.startsWith("RT") ? "Retread" : "Repair",

            batchNo: batch.batchNumber,

            currentStageStatus: casing.currentStageStatus,

            // batch summary
            approved: batch.stageSummary?.approved || 0,
            rejected: batch.stageSummary?.rejected || 0,
            pending: batch.stageSummary?.pending || 0,
            previousStage: batch.stageSummary?.stillAtPreviousStage || 0,
            expectedTotal:
              batch.stageSummary?.expectedTotal || batch.originalBatchSize,
            arrived: batch.stageSummary?.arrived || 0,

            // modal fields
            isRetreaded: false,
            previousPattern: "",
            previousRetreader: "",
            noOfRetread: 0,
            noOfExistingRepairs: 0,

            originalBatch: batch,
            originalCasing: casing,
          })),
        ) || [];

      setRows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  return {
    rows,
    loading,
    fetchRows,
  };
};

export default useQualityControlIndexTable;
