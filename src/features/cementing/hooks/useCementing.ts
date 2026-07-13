import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import cementingService from "../service/cementingService";

export const useCementing = () => {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<any[]>([]);
  const [openingStockKg, setOpeningStockKg] = useState<number>();

  const [closingStockKg, setClosingStockKg] = useState<number>();
  const [cementType, setCementType] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cementTypes, setCementTypes] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  const { getCementTypes, saveCementing, approveCementing } = cementingService;

  const loadCementing = async (stageId: number = 9, statusId: number = 1) => {
    try {
      setLoading(true);

      const res = await indexPageApiService.getBatchProgress(stageId, statusId);

      console.log("CEMENTING BATCH API", res.data);

      const transformed: any[] = [];

      (res.data?.data || []).forEach((stage: any) => {
        stage.batches?.forEach((batch: any) => {
          batch.casings?.forEach((casing: any) => {
            transformed.push({
              id: casing.orderCasingId,

              casing: casing.productionNumber || "-",

              serial: casing.tyreReferenceNumber || "-",

              dot: casing.dotNumber || "-",

              tyreSize: casing.tyreSizeLabel || "-",

              patternName: casing.patternName || "-",

              requestedPattern: "-",

              date: casing.orderDate || "-",
              tyreMakeName:casing.tyreMakeName || "-",

              customerName: casing.customerName || "-",

              service: batch.batchNumber?.startsWith("RT")
                ? "Retread"
                : "Repair",

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
      const res = await getCementTypes();

      setCementTypes(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Error loading cement types", error);
    }
  };

  const handleSave = async (payload: any) => {
    try {
      setLoading(true);

      const res = await saveCementing(payload);

      return res.data;
    } catch (error) {
      console.error("Error saving cementing", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payload: any) => {
    try {
      setLoading(true);

      const res = await approveCementing(payload);
      await loadCementing();

      return res.data;
    } catch (error) {
      console.error("Error approving cementing", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetStockManagement = () => {
  setOpeningStockKg(undefined);
  setClosingStockKg(undefined);
};
  return {
    inspections,
    loading,
    processing,
    loadCementing,
    cementType,
    setCementType,
    openingStockKg,
    setOpeningStockKg,

    closingStockKg,
    setClosingStockKg,
    selectedItem,
    setSelectedItem,
    cementTypes,
    loadCementTypes,

    handleSave,
    handleApprove,
    resetStockManagement,
  };
};
