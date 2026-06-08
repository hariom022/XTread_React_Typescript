import { useEffect, useState } from "react";

import shearographyService from "../service/shearographyService";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const transformApiData = (stages: any[]) => {
  const list: any[] = [];

  stages.forEach((stage: any) => {
    stage.batches?.forEach((batch: any) => {
      batch.casings?.forEach((casing: any) => {
        list.push({
          id: casing.orderCasingId,

          casing:
            casing.productionNumber ||
            casing.barcodeNumber ||
            "-",

          date:
            casing.orderDate ||
            batch.createdAtUtc ||
            null,

          serial:
            casing.tyreReferenceNumber ||
            "-",

          patternName:
            casing.patternName ||
            "-",

          requestedPattern:
            casing.patternName ||
            "-",

          tyreSize:
            casing.tyreSizeLabel ||
            "-",

          customerName:
            casing.customerName ||
            "-",

          service:
            batch.batchNumber?.startsWith("RT")
              ? "Retread"
              : "Repair",

          batchNo:
            batch.batchNumber ||
            "-",

          currentStage:
            casing.currentStage,

          currentStageStatus:
            casing.currentStageStatus,
                      // batch summary
          approved:
            batch.stageSummary?.approved || 0,

          rejected:
            batch.stageSummary?.rejected || 0,

          pending:
            batch.stageSummary?.pending || 0,

          previousStage:
            batch.stageSummary
              ?.stillAtPreviousStage || 0,

          expectedTotal:
            batch.stageSummary
              ?.expectedTotal ||
            batch.originalBatchSize,
          casingLife:
            `${casing.noOfRetread || 1}/5`,
          arrived:
            batch.stageSummary?.arrived || 0,
        });
      });
    });
  });

  return list;
};

export const useShearography = () => {
  const [loading, setLoading] = useState(false);

  const [inspections, setInspections] =
    useState<any[]>([]);

  const [rejectionReasons, setRejectionReasons] =
    useState<any[]>([]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const result =
        await indexPageApiService.getBatchProgress(
          6,
          1
        );

      console.log(
        "Shearography Orders",
        result.data
      );

      const transformed = transformApiData(
        result?.data?.data || []
      );

      setInspections(transformed);
    } catch (error) {
      console.error(
        "Failed to load shearography orders",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRejectionReasons = async () => {
    try {
      const result =
        await shearographyService.getRejectionReason();

      console.log(
        "Shearography Rejection Reasons",
        result.data
      );

      setRejectionReasons(
        result?.data?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load rejection reasons",
        error
      );
    }
  };

  useEffect(() => {
    loadOrders();
    loadRejectionReasons();
  }, []);

  return {
    loading,

    inspections,

    rejectionReasons,

    loadOrders,
  };
};