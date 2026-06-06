import { useEffect, useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const usePressureTest = () => {
  const [loading, setLoading] = useState(false);

  const [pressureTestList, setPressureTestList] = useState<any[]>([]);

  const loadPressureTestOrders = async () => {
    try {
      setLoading(true);

      const result =
        await indexPageApiService.getBatchProgress(
          5, // Pressure Test Stage
          1
        );

      const stages = result.data.data || [];

      const transformed: any[] = [];

      stages.forEach((stage: any) => {
        stage.batches?.forEach((batch: any) => {
          batch.casings?.forEach((casing: any) => {
            transformed.push({
              id: casing.orderCasingId,

              orderCasingId:
                casing.orderCasingId,

              casing:
                casing.productionNumber,

              serial:
                casing.tyreReferenceNumber,

              date:
                casing.orderDate,

              customerName:
                casing.customerName,

              patternName:
                casing.patternName || "-",

              tyreSize:
                casing.tyreSizeLabel,

              service:
                batch.batchNumber.startsWith("RT")
                  ? "Retread"
                  : "Repair",

              batchNo:
                batch.batchNumber,

              approved:
                batch.stageSummary.approved,

              rejected:
                batch.stageSummary.rejected,

              pending:
                batch.stageSummary.pending,

              expectedTotal:
                batch.stageSummary.expectedTotal,

              originalBatch:
                batch,

              originalCasing:
                casing,
            });
          });
        });
      });

      setPressureTestList(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPressureTestOrders();
  }, []);

  return {
    loading,
    pressureTestList,
    loadPressureTestOrders,
  };
};