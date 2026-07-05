import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";
//   import cementingService from "../service/cementingService";
import treadBenchService from "../service/treadBenchService";
import { type CementType } from "../types/treadBenchTypes";

export const useTreadBench = () => {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<any[]>([]);
  const [cementTypes, setCementTypes] = useState<CementType[]>([]);
  const loadTreadBench = async (stageId: number = 9, statusId?: number ) => {
    try {
      setLoading(true);

      const res = await indexPageApiService.getBatchProgress(stageId, statusId);

      console.log("CEMENTING BATCH API", res.data);

      const transformed: any[] = [];

      (res.data?.data || []).forEach((stage: any) => {
        stage.batches?.forEach((batch: any) => {
          batch.casings?.forEach((casing: any) => {
            // Don't show if tread bench data is already collected
            if (casing.isTreadBenchDataCollected) return;

            transformed.push({
              id: casing.orderCasingId,

              casing: casing.productionNumber || "-",

              serial: casing.tyreReferenceNumber || "-",

              dot: casing.dotNumber || "-",

              tyreSize: casing.tyreSizeLabel || "-",

              patternName: casing.patternName || "-",

              requestedPattern: "-",

              date: casing.orderDate || "-",

              customerName: casing.customerName || "-",

              service: batch.batchNumber?.startsWith("RT")
                ? "Retread"
                : "Repair",

              batchNo: batch.batchNumber,

              currentStageStatus: casing.currentStageStatus,

              approved: batch.stageSummary?.approved || 0,
              rejected: batch.stageSummary?.rejected || 0,
              pending: batch.stageSummary?.pending || 0,
              previousStage: batch.stageSummary?.stillAtPreviousStage || 0,
              expectedTotal:
                batch.stageSummary?.expectedTotal || batch.originalBatchSize,
              arrived: batch.stageSummary?.arrived || 0,

              isRetreaded: false,
              previousPattern: "",
              previousRetreader: "",
              noOfRetread: 0,
              noOfExistingRepairs: 0,

              originalBatch: batch,
              originalCasing: casing,
            });
          });
        });
      });
      setInspections(transformed);

      return transformed;
    } catch (error) {
      console.error("Error loading cementing data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadCementTypes = async () => {
    try {
      const res = await treadBenchService.getCementTypes();

      setCementTypes(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async (payload: any) => {
    try {
      setLoading(true);

      const res = await treadBenchService.saveCementTypes(payload);

      return res.data;
    } catch (error) {
      console.error("Error saving cementing", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    inspections,
    loading,
    loadTreadBench,
    cementTypes,
    loadCementTypes,
    handleSave,
  };
};
