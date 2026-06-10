import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type{
  skivingStage1Row,
  InspectionRepair,
} from "../types/skivingStage1Types";

const SKIVING_STAGE_1_STAGE = 8;
const SKIVING_STAGE_1_SUBSTAGE = 81;
const ACTIVE_STATUS = 1;

interface ApiOperation {
  repairLocation: string;
  repairType: string;
}

interface ApiCasing {
  orderCasingId: number;

  productionNumber?: string;
  barcodeNumber?: string;

  tyreReferenceNumber?: string;

  dotNumber?: string;

  tyreSizeLabel?: string;

  patternName?: string;

  orderDate?: string;

  customerName?: string;

  damageLevelId?: number;

  currentStage: number;
  currentSubstage: number;
  currentStageStatus: number;

  repairDetail?: {
    operations?: ApiOperation[];
  };
}

interface ApiBatch {
  batchNumber?: string;

  casings?: ApiCasing[];
}

interface ApiStage {
  batches?: ApiBatch[];
}

export const useSkivingStage1IndexTable = (
  search: string
) => {
  const [loading, setLoading] =
    useState<boolean>(false);

  const [
    skivingStage1Data,
    setSkivingStage1Data,
  ] = useState<skivingStage1Row[]>([]);

  const transformSkivingStage1Data = (
    stages: ApiStage[]
  ): skivingStage1Row[] => {
    const transformed: skivingStage1Row[] = [];

    (stages || []).forEach((stage) => {
      stage.batches?.forEach((batch) => {
        batch.casings?.forEach((casing) => {
          const inspectionRepairs: InspectionRepair[] =
            casing.repairDetail?.operations?.map(
              (op) => ({
                location:
                  op.repairLocation,
                type:
                  op.repairType,
                foundAt:
                  "Nail Inspection",
              })
            ) || [];

          transformed.push({
            id:
              casing.orderCasingId,

            casing:
              casing.productionNumber ||
              casing.barcodeNumber ||
              "-",

            serial:
              casing.tyreReferenceNumber ||
              "-",

            pattern:
              casing.patternName ||
              "-",

            requestedPattern:
              casing.patternName ||
              "-",

            date:
              casing.orderDate ||
              "-",

            customerName:
              casing.customerName ||
              "-",

            service:
              batch.batchNumber?.startsWith(
                "RT"
              )
                ? "Retread"
                : "Repair",

            batchNo:
              batch.batchNumber ||
              "-",

            damageLevel:
              casing.damageLevelId === 1
                ? "Normal"
                : casing.damageLevelId === 2
                  ? "Heavy"
                  : "-",

            inspectionRepairs,

            tyreSize:
              casing.tyreSizeLabel ||
              "-",

            tyreMake: "-",

            model: "-",

            brand: "-",

            width: "-",

            tyresCollected: 1,

            tyresAvailable: 1,

            collectorZone: "-",

            currentStage:
              casing.currentStage,

            currentSubstage:
              casing.currentSubstage,

            currentStageStatus:
              casing.currentStageStatus,
          });
        });
      });
    });

    return transformed;
  };

  const loadSkivingStage1 =
    async (): Promise<void> => {
      try {
        setLoading(true);

        const res =
          await indexPageApiService.getBatchProgress(
            SKIVING_STAGE_1_STAGE,
            SKIVING_STAGE_1_SUBSTAGE,
            ACTIVE_STATUS
          );

        const transformed =
          transformSkivingStage1Data(
            res.data?.data || []
          );

        setSkivingStage1Data(
          transformed
        );
      } catch (error) {
        console.error(
          "Skiving Stage 1 Error",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadSkivingStage1();
  }, []);

  const filteredSkiving =
    useMemo(() => {
      return skivingStage1Data.filter(
        (item) =>
          `${item.casing}
           ${item.serial}
           ${item.pattern}`
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      search,
      skivingStage1Data,
    ]);

  return {
    loading,

    skivingStage1Data,

    filteredSkiving,

    loadSkivingStage1,
  };
};