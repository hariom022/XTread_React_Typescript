import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type {
  SkivingApprovalRow,
  RepairOperation,
} from "../types/skivingApproval.types";

const SKIVING_STAGE = 8;
const SKIVING_APPROVAL_SUBSTAGE = 82;
const ACTIVE_STATUS = 1;

const useSkivingApprovalTable = () => {
  const [search, setSearch] = useState("");

  const [skivingApprovalData, setSkivingApprovalData] = useState<
    SkivingApprovalRow[]
  >([]);

  const transformData = (stages: any[]): SkivingApprovalRow[] => {
    const list: SkivingApprovalRow[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage === SKIVING_STAGE &&
            casing.currentSubstage === SKIVING_APPROVAL_SUBSTAGE &&
            casing.currentStageStatus === ACTIVE_STATUS
          ) {
            list.push({
              id: casing.orderCasingId,

              casing: casing.productionNumber || casing.barcodeNumber || "-",
              service: casing.serviceTypeName || "-",
              date: casing.orderDate ? casing.orderDate.split("T")[0] : "-",

              serial: casing.tyreReferenceNumber || "-",

              patternName: casing.patternName || "-",

              requestedPattern: casing.patternName || "-",

              tyreSize: casing.tyreSizeLabel || "-",
              tyreMakeName:casing.tyreMakeName || "-",

              tyreMake: "-",

              model: "-",

              brand: "-",

              width: "-",

              customerName: casing.customerName || "-",

              batchNo: batch.batchNumber || "-",

              tyresCollected: 1,

              tyresAvailable: 1,

              collectorZone: "-",

              damageLevel: "-",

              repairOperations: [],

              currentStage: casing.currentStage,

              currentSubstage: casing.currentSubstage,

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
          }
        });
      });
    });

    return list;
  };

  const fetchSkivingApprovalOrders = async () => {
    try {
      const response = await indexPageApiService.getBatchProgress(
        SKIVING_STAGE,
        SKIVING_APPROVAL_SUBSTAGE,
        ACTIVE_STATUS,
      );
      console.log(
        "SKIVING APPROVAL RESPONSE",
        JSON.stringify(response.data.data, null, 2),
      );

      const transformed = transformData(response.data.data || []);

      setSkivingApprovalData(transformed);
    } catch (error) {
      console.error("Skiving Approval Error", error);
    }
  };

  useEffect(() => {
    fetchSkivingApprovalOrders();
  }, []);

  const filteredData = useMemo(() => {
    return skivingApprovalData.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, skivingApprovalData]);

  return {
    search,
    setSearch,

    skivingApprovalData,

    filteredData,

    fetchSkivingApprovalOrders,
  };
};

export default useSkivingApprovalTable;
