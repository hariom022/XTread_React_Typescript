import { useEffect, useMemo, useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import type { PreBuffingRow } from "../types/preBuffingTypes";

const PRE_BUFFING_STAGE = 7;
const PRE_BUFFING_SUBSTAGE = 71;
const ACTIVE_STATUS = 1;

const usePreBuffingIndexTable = () => {
  const [search, setSearch] = useState("");
  const [preBuffingData, setPreBuffingData] = useState<
    PreBuffingRow[]
  >([]);

  const transformApiData = (
    stages: any[]
  ): PreBuffingRow[] => {
    const transformed: PreBuffingRow[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage === PRE_BUFFING_STAGE &&
            casing.currentSubstage === PRE_BUFFING_SUBSTAGE &&
            casing.currentStageStatus === ACTIVE_STATUS
          ) {
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
              
              tyreMakeName:casing.tyreMakeName || "-",

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
          }
        });
      });
    });

    return transformed;
  };

  const fetchPreBuffingOrders = async () => {
    try {
      const response =
        await indexPageApiService.getBatchProgress(
          PRE_BUFFING_STAGE,
          PRE_BUFFING_SUBSTAGE,
          ACTIVE_STATUS
        );

      console.log(
        "PRE BUFFING RESPONSE",
        response.data
      );
      console.log("FULL RESPONSE", response.data);

      const transformed =
        transformApiData(
          response.data.data || []
        );

      setPreBuffingData(transformed);
    } catch (error) {
      console.error(
        "Pre Buffing Orders Error",
        error
      );
    }
  };

  useEffect(() => {
    fetchPreBuffingOrders();
  }, []);

 const filteredData = useMemo(() => {
  return preBuffingData.filter((item) =>
    `${item.casing}
     ${item.serial}
     ${item.patternName}
     ${item.customerName}
     ${item.batchNo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}, [search, preBuffingData]);

  return {
    search,
    setSearch,
    preBuffingData,
    filteredData,
    fetchPreBuffingOrders,
  };
};

export default usePreBuffingIndexTable;