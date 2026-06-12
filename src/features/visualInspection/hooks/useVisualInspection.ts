import { useEffect, useState } from "react";

import visualInspectionService from "../service/visualInspectionService";
import indexPageApiService from "../../../shared/services/indexPageApiService";
export const useVisualInspection = () => {
  const [loading, setLoading] = useState(false);

  const [inspections, setInspections] = useState<any[]>([]);

  const [rejectionReasons, setRejectionReasons] = useState([]);

  const loadVisualInspection = async () => {
    try {
      setLoading(true);

      const res = await indexPageApiService.getBatchProgress(3, 1);

      console.log("VISUAL BATCH API", res.data);

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

              patternName:casing?.patternName || "-",

              requestedPattern: "-",

              date:casing.orderDate ||  "-",

              customerName:casing.customerName ||  "-",

              service: casing.serviceTypeName || "-",

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

      console.log("TRANSFORMED VISUAL", transformed);

      setInspections(transformed);
    } finally {
      setLoading(false);
    }
  };

  const loadRejectionReasons = async () => {
    const res = await visualInspectionService.getRejectionReason();

    setRejectionReasons(res.data.data);
  };

  useEffect(() => {
    loadVisualInspection();
    loadRejectionReasons();
  }, []);

  return {
    loading,

    inspections,

    rejectionReasons,

    loadVisualInspection,
  };
};
