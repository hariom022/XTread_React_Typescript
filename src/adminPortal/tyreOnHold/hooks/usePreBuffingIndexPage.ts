
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import holdTyreServiceApi from "../service/holdTyreServiceApi";

export type HoldTab = "buffing";

export const usePreBuffingIndexPage = (
  activeTab: HoldTab
) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [holdTyres, setHoldTyres] = useState<any[]>([]);

  // =========================================================
  // LOAD PRE-BUFFING HOLD TYRES
  // Existing Pre-Buffing API and transformation are preserved.
  // =========================================================
  const loadHoldTyres = useCallback(async () => {
    try {
      setLoading(true);
      setHoldTyres([]);

      const result =
        await holdTyreServiceApi.getPreBuffingHoldTyres();

      console.log("BUFFING HOLD API RESULT:", result);

      const stages = result?.data?.data || [];

      const casings = stages.flatMap(
        (stage: any) =>
          stage.batches?.flatMap(
            (batch: any) =>
              batch.casings?.map((casing: any) => ({
                ...casing,
                batchNumber: batch.batchNumber,
              })) || []
          ) || []
      );

      const transformedData = casings.map((casing: any) => ({
        id: casing.orderCasingId,
        orderCasingId: casing.orderCasingId,

        casing: casing.productionNumber || "-",
        date: casing.orderDate || "-",
        serial: casing.tyreReferenceNumber || "-",
        dot: casing.dotNumber || "-",
        patternName: casing.patternName || "-",
        tyreMakeName: casing.tyreMakeName || "-",
        tyreSize: casing.tyreSizeLabel || "-",
        customerName: casing.customerName || "-",
        service: casing.serviceTypeName || "-",

        casingStage: casing.currentStage,
        currentSubstage: casing.currentSubstage,
        currentStageStatus: casing.currentStageStatus,

        batchNumber: casing.batchNumber,

        originalHold: casing,
      }));

      console.log("BUFFING HOLD TABLE DATA:", transformedData);

      setHoldTyres(transformedData);
    } catch (error) {
      console.error("Failed to load Pre-Buffing Hold tyres:", error);
      setHoldTyres([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // LOAD DATA WHEN THE PRE-BUFFING TAB IS ACTIVE
  // =========================================================
  useEffect(() => {
    setSearch("");
    void loadHoldTyres();
  }, [loadHoldTyres]);

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredHoldTyres = useMemo(() => {
    const searchText = search.toLowerCase().trim();

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
         ${item.batchNumber}`
          .toLowerCase()
          .includes(searchText)
    );
  }, [search, holdTyres]);

  return {
    loading,
    search,
    setSearch,
    holdTyres,
    filteredHoldTyres,
    loadHoldTyres,
  };
};
