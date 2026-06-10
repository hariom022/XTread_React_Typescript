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
    const list: PreBuffingRow[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage === PRE_BUFFING_STAGE &&
            casing.currentSubstage === PRE_BUFFING_SUBSTAGE &&
            casing.currentStageStatus === ACTIVE_STATUS
          ) {
            list.push({
              id: casing.orderCasingId,

              casing:
                casing.productionNumber ||
                casing.barcodeNumber ||
                "-",

              serial:
                casing.tyreReferenceNumber || "-",

              customerName:
                casing.customerName || "-",

              tyreSize:
                casing.tyreSizeLabel || "-",

              tyreMake: "-",

              model: "-",

              pattern:
                casing.patternName || "-",

              requestedPattern:
                casing.patternName || "-",

              brand: "-",

              width: "-",

              currentStage:
                casing.currentStage,

              currentSubstage:
                casing.currentSubstage,

              currentStageStatus:
                casing.currentStageStatus,
            });
          }
        });
      });
    });

    return list;
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
       ${item.pattern}`
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