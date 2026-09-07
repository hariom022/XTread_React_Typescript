import {
  useEffect,
  useMemo,
  useState,
} from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

export type HoldTab =
  | "nail"
  | "shearography"
  | "buffing";

export const useHoldTyreIndexPage = (
  activeTab: HoldTab
) => {
  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [holdTyres, setHoldTyres] =
    useState<any[]>([]);

  // =========================================================
  // TRANSFORM API RESPONSE
  // =========================================================
  const transformApiData = (
    stages: any[]
  ) => {
    const transformed: any[] = [];

    (stages || []).forEach(
      (stage: any) => {
        stage.batches?.forEach(
          (batch: any) => {
            batch.casings?.forEach(
              (casing: any) => {
                transformed.push({
                  id:
                    casing.orderCasingId,

                  casing:
                    casing.productionNumber ||
                    casing.barcodeNumber ||
                    "-",

                  date:
                    casing.orderDate ||
                    "-",

                  serial:
                    casing.tyreReferenceNumber ||
                    "-",

                  dot:
                    casing.dotNumber ||
                    "-",

                  patternName:
                    casing.patternName ||
                    "-",

                  tyreMakeName:
                    casing.tyreMakeName ||
                    "-",

                  tyreSize:
                    casing.tyreSizeLabel ||
                    "-",

                  customerName:
                    casing.customerName ||
                    "-",

                  service:
                    casing.serviceTypeName ||
                    "-",

                  batchNo:
                    batch.batchNumber ||
                    "-",

                  currentStage:
                    casing.currentStage,

                  currentStageStatus:
                    casing.currentStageStatus,

                  currentSubstage:
                    casing.currentSubstage,

                  requestedPattern:
                    casing.patternName ||
                    "-",

                  // Keep original API data
                  originalBatch:
                    batch,

                  originalCasing:
                    casing,

                  // Batch summary
                  approved:
                    batch.stageSummary
                      ?.approved || 0,

                  rejected:
                    batch.stageSummary
                      ?.rejected || 0,

                  pending:
                    batch.stageSummary
                      ?.pending || 0,

                  previousStage:
                    batch.stageSummary
                      ?.stillAtPreviousStage ||
                    0,

                  rejectedAtPreviousStages:
                    batch.stageSummary
                      ?.rejectedAtPreviousStages ||
                    0,

                  expectedTotal:
                    batch.stageSummary
                      ?.expectedTotal ??
                    batch.originalBatchSize ??
                    0,

                  arrived:
                    batch.stageSummary
                      ?.arrived || 0,
                });
              }
            );
          }
        );
      }
    );

    return transformed;
  };

  // =========================================================
  // LOAD HOLD TYRES
  // =========================================================
  const loadHoldTyres = async () => {
    try {
      setLoading(true);

      setHoldTyres([]);

      let result;

      // =====================================================
      // 1. NAIL INSPECTION HOLD
      // =====================================================
      if (activeTab === "nail") {
        result =
          await indexPageApiService.getBatchProgress(
            4,
            6
          );
      }

      // =====================================================
      // 2. SHEAROGRAPHY HOLD
      // =====================================================
      else if (
        activeTab === "shearography"
      ) {
        /*
          IMPORTANT:
          Add the exact Shearography parameters here.

          Example only:
          
          result =
            await indexPageApiService.getBatchProgress(
              6,
              3
            );

          DO NOT use the example until the
          actual Shearography API parameters
          are confirmed.
        */

        result = {
          data: {
            data: [],
          },
        };
      }

      // =====================================================
      // 3. BUFFING HOLD
      // =====================================================
      else if (activeTab === "buffing") {
        result =
          await indexPageApiService.getBatchProgress(
            7,
            71,
            3
          );
      }

      console.log(
        `${activeTab.toUpperCase()} HOLD API RESULT:`,
        result
      );

      // =====================================================
      // GET API DATA
      // =====================================================
      const apiData =
        result?.data?.data || [];

      // =====================================================
      // TRANSFORM
      // =====================================================
      const transformed =
        transformApiData(apiData);

      console.log(
        `${activeTab.toUpperCase()} HOLD TRANSFORMED DATA:`,
        transformed
      );

      setHoldTyres(transformed);
    } catch (error) {
      console.error(
        `Failed to load ${activeTab} hold tyres:`,
        error
      );

      setHoldTyres([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA WHEN TAB CHANGES
  // =========================================================
  useEffect(() => {
    setSearch("");

    loadHoldTyres();
  }, [activeTab]);

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredHoldTyres =
    useMemo(() => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return holdTyres;
      }

      return holdTyres.filter(
        (item) =>
          `${item.casing}
           ${item.serial}
           ${item.dot}
           ${item.patternName}
           ${item.tyreMakeName}
           ${item.tyreSize}
           ${item.customerName}
           ${item.service}
           ${item.batchNo}`
            .toLowerCase()
            .includes(searchText)
      );
    }, [search, holdTyres]);

  // =========================================================
  // RETURN
  // =========================================================
  return {
    loading,

    search,
    setSearch,

    holdTyres,
    filteredHoldTyres,

    loadHoldTyres,
  };
};