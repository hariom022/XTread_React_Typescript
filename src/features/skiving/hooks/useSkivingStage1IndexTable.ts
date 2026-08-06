import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type {
  SkivingStage1Row,
  InspectionRepair,
} from "../types/skivingStage1.types";

const SKIVING_STAGE = 8;
const SKIVING_STAGE1_SUBSTAGE = 81;
const ACTIVE_STATUS = 1;

const useSkivingStage1Table = () => {
  const [search, setSearch] = useState("");

  const [skivingStage1Data, setSkivingStage1Data] = useState<
    SkivingStage1Row[]
  >([]);

  const transformData = (stages: any[]): SkivingStage1Row[] => {
    const list: SkivingStage1Row[] = [];

    stages.forEach((stage) => {
      stage.batches?.forEach((batch: any) => {
        batch.casings?.forEach((casing: any) => {
          if (
            casing.currentStage === SKIVING_STAGE &&
            casing.currentSubstage === SKIVING_STAGE1_SUBSTAGE &&
            casing.currentStageStatus === ACTIVE_STATUS
          ) {
            console.log("CASING stage 1", casing);
            console.log("PATTERN VALUE:", casing.patternName);
            list.push({
              id: casing.orderCasingId,

              casing: casing.productionNumber || casing.barcodeNumber || "-",
              service: casing.serviceTypeName || "-",
              date: casing.orderDate ? casing.orderDate.split("T")[0] : "-",

              serial: casing.tyreReferenceNumber || "-",

              patternName: casing.patternName || "-",

              requestedPattern: casing?.patternName || "-",

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

              inspectionRepairs: [],

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

  const fetchSkivingStage1Orders = async () => {
    try {
      const response = await indexPageApiService.getBatchProgress(
        SKIVING_STAGE,
        SKIVING_STAGE1_SUBSTAGE,
        ACTIVE_STATUS,
      );
      console.log(
        "SKIVING STAGE 1 RESPONSE",
        JSON.stringify(response.data.data, null, 2),
      );

      const transformed = transformData(response.data.data || []);
      console.log("TRANSFORMED", transformed);
      setSkivingStage1Data(transformed);
    } catch (error) {
      console.error("Skiving Stage 1 Error", error);
    }
  };

  useEffect(() => {
    fetchSkivingStage1Orders();
  }, []);

  const filteredData = useMemo(() => {
    return skivingStage1Data.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, skivingStage1Data]);

  return {
    search,
    setSearch,

    skivingStage1Data,

    filteredData,

    fetchSkivingStage1Orders,
  };
};

export default useSkivingStage1Table;
