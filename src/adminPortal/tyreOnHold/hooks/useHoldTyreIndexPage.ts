import {
  useEffect,
  useMemo,
  useState,
} from "react";

import holdTyreServiceApi from "../service/holdTyreServiceApi";

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
  // LOAD HOLD TYRES
  // =========================================================
  const loadHoldTyres = async () => {
    try {
      setLoading(true);
      setHoldTyres([]);

      let result;

      // =====================================================
      // NAIL INSPECTION HOLD
      // =====================================================
      if (activeTab === "nail") {
        result =
          await holdTyreServiceApi.getHoldTyres(4,
            undefined,
            true,
            1
          );
      }

      // =====================================================
      // SHEAROGRAPHY HOLD
      // =====================================================
      else if (activeTab === "shearography") {
        result =
          await holdTyreServiceApi.getHoldTyres(6,
            undefined,
            true,
            1
          );
      }

      // =====================================================
      // PRE-BUFFING HOLD
      // =====================================================
      else if (activeTab === "buffing") {
        result =
          await holdTyreServiceApi.getHoldTyres(
            7,
            71,
            true,
            1
          );
      }

      console.log(
        `${activeTab.toUpperCase()} HOLD API RESULT:`,
        result
      );

      const apiData =
        result?.data?.data || [];

      console.log(
        `${activeTab.toUpperCase()} HOLD DATA:`,
        apiData
      );

      // =====================================================
      // MAP NEW HOLD API FIELDS TO EXISTING TABLE FIELDS
      // =====================================================
      const transformedData = apiData.map(
        (hold: any) => ({
          holdId: hold.holdId,
          orderCasingId: hold.orderCasingId,

          casing:
            hold.productionNumber || "-",

          date:
            hold.createdAtUtc || "-",

          serial:
            hold.tyreReferenceNumber || "-",

          dot: "-",

          patternName: "-",

          tyreMakeName:
            hold.tyreMakeName || "-",

          tyreSize:
            hold.tyreSizeLabel || "-",

          customerName:
            hold.customerName || "-",

          service:
            hold.serviceTypeName || "-",

          holdType:
            hold.holdType,

          lpoNumber:
            hold.lpoNumber,

          holdDate:
            hold.date,

          amount:
            hold.amount,

          remarks:
            hold.remarks,

          isApproved:
            hold.isApproved,

          casingStage:
            hold.casingStage,

          createdAtUtc:
            hold.createdAtUtc,

          originalHold:
            hold,
        })
      );

      console.log(
        `${activeTab.toUpperCase()} HOLD TABLE DATA:`,
        transformedData
      );

      setHoldTyres(transformedData);

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
           ${item.service}`
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