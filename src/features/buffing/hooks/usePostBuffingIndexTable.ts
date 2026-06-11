import { useEffect, useMemo, useState } from "react";
import type { PostBuffingRow } from "../types/postBuffingTypes";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const POST_BUFFING_STAGE = 7;
const POST_BUFFING_SUBSTAGE = 72;
const ACTIVE_STATUS = 1;

const usePostBuffingIndexTable = () => {
  const [search, setSearch] = useState("");

  const [postBuffingData, setPostBuffingData] = useState<PostBuffingRow[]>([]);

  const transformData = (stages: any[]): PostBuffingRow[] => {
    const list: PostBuffingRow[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage === POST_BUFFING_STAGE &&
            casing.currentSubstage === POST_BUFFING_SUBSTAGE &&
            casing.currentStageStatus === ACTIVE_STATUS
          ) {
            list.push({
              id: casing.orderCasingId,

              batchNo: batch.batchNumber || "-",

              casing: casing.productionNumber || "-",

              serial: casing.tyreReferenceNumber || "-",

              dot: casing.dotNumber || "-",

              customerName: casing.customerName || "-",

              tyreSize: casing.tyreSizeLabel || "-",

              patternName: casing.patternName || "-",

              requestedPattern: casing.patternName || "-",

              date: casing.orderDate || "",

              service: batch.batchNumber?.startsWith("RT")
                ? "Retread"
                : "Repair",

              approved: batch.stageSummary?.approved || 0,

              rejected: batch.stageSummary?.rejected || 0,

              pending: batch.stageSummary?.pending || 0,

              previousStage: batch.stageSummary?.stillAtPreviousStage || 0,

              expectedTotal: batch.stageSummary?.expectedTotal || 0,

              arrived: batch.stageSummary?.arrived || 0,

              currentStage: casing.currentStage,

              currentSubstage: casing.currentSubstage,

              currentStageStatus: casing.currentStageStatus,

              // modal defaults

              tyreMake: "-",

              model: "-",

              brand: "-",

              width: "-",

              isRetreaded: false,

              previousPattern: "-",

              previousRetreader: "-",

              noOfRetread: 0,

              noOfExistingRepairs: 0,
            });
          }
        });
      });
    });

    return list;
  };

  const fetchPostBuffingOrders = async () => {
    try {
      const response = await indexPageApiService.getBatchProgress(
        POST_BUFFING_STAGE,
        POST_BUFFING_SUBSTAGE,
        ACTIVE_STATUS,
      );

      console.log("POST BUFFING RESPONSE", response.data);

      const transformed = transformData(response.data.data || []);

      setPostBuffingData(transformed);
    } catch (error) {
      console.error("Post Buffing Error", error);
    }
  };

  useEffect(() => {
    fetchPostBuffingOrders();
  }, []);

  const filteredData = useMemo(() => {
    return postBuffingData.filter((item) =>
      `${item.casing}
     ${item.serial}
     ${item.patternName}
     ${item.customerName}
     ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
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
