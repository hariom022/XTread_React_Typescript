import { useEffect, useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useCementing = () => {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<any[]>([]);

  const transformApiData = (stages: any[]) => {
    const transformed: any[] = [];

    (stages || []).forEach((stage: any) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          transformed.push({
            id: casing.orderCasingId,

            casing:
              casing.productionNumber ||
              casing.barcodeNumber ||
              "-",

            date:
              casing.orderDate || "-",

            serial:
              casing.tyreReferenceNumber || "-",

            patternName:
              casing.patternName || "-",

            tyreSize:
              casing.tyreSizeLabel || "-",

            customerName:
              casing.customerName || "-",

            service:
              batch.batchNumber?.startsWith("RT")
                ? "Retread"
                : "Repair",

            batchNo:
              batch.batchNumber || "-",

            currentStageStatus:
              casing.currentStageStatus,

            approved:
              batch.stageSummary?.approved || 0,

            rejected:
              batch.stageSummary?.rejected || 0,

            pending:
              batch.stageSummary?.pending || 0,

            previousStage:
              batch.stageSummary?.stillAtPreviousStage || 0,

            expectedTotal:
              batch.stageSummary?.expectedTotal ||
              batch.originalBatchSize,

            arrived:
              batch.stageSummary?.arrived || 0,
          });
        });
      });
    });

    return transformed;
  };

  const loadCementing = async () => {
    try {
      setLoading(true);

      const result =
        await indexPageApiService.getBatchProgress(
          9, // Cementing
          1
        );

      console.log(result);

      const transformed =
        transformApiData(
          result.data.data
        );

      console.log(transformed);

      setInspections(transformed);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCementing();
  }, []);

  return {
    loading,
    inspections,
    loadCementing,
  };
};