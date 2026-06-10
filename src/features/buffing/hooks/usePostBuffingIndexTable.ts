import { useEffect, useMemo, useState } from "react";
import type { PostBuffingRow } from "../types/postBuffingTypes";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const POST_BUFFING_STAGE = 7;
const POST_BUFFING_SUBSTAGE = 72;
const ACTIVE_STATUS = 1;

const usePostBuffingIndexTable = () => {
  const [search, setSearch] = useState("");

  const [postBuffingData, setPostBuffingData] =
    useState<PostBuffingRow[]>([]);

  const transformData = (
    stages: any[]
  ): PostBuffingRow[] => {
    const list: PostBuffingRow[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage ===
            POST_BUFFING_STAGE &&
            casing.currentSubstage ===
            POST_BUFFING_SUBSTAGE &&
            casing.currentStageStatus ===
            ACTIVE_STATUS
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

  const fetchPostBuffingOrders =
    async () => {
      try {
        const response =
          await indexPageApiService.getBatchProgress(
            POST_BUFFING_STAGE,
            POST_BUFFING_SUBSTAGE,
            ACTIVE_STATUS
          );

        console.log(
          "POST BUFFING RESPONSE",
          response.data
        );

        const transformed =
          transformData(
            response.data.data || []
          );

        setPostBuffingData(transformed);
      } catch (error) {
        console.error(
          "Post Buffing Error",
          error
        );
      }
    };

  useEffect(() => {
    fetchPostBuffingOrders();
  }, []);

  const filteredData = useMemo(() => {
    return postBuffingData.filter((item) =>
      `${item.casing}
       ${item.serial}
       ${item.pattern}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, postBuffingData]);

  return {
    search,
    setSearch,
    postBuffingData,
    filteredData,
    fetchPostBuffingOrders,
  };
};

export default usePostBuffingIndexTable;