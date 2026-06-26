import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type { FillUpRow } from "../types/fillUp.types";

const FILLUP_STAGE = 11; // change later if backend gives another stage

const ACTIVE_STATUS = 1;

const useFillUpIndexTable = () => {
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [fillUpData, setFillUpData] =
    useState<FillUpRow[]>([]);

  const loadFillUpOrders = async () => {
    try {
      setLoading(true);

      const result =
        await indexPageApiService.getBatchProgress(
          FILLUP_STAGE,
          ACTIVE_STATUS
        );
console.log("BATCH ORDER FILLUP", result.data.data)
      const stages =
        result.data.data || [];

      const transformed: FillUpRow[] = [];

      stages.forEach((stage: any) => {
        stage.batches?.forEach(
          (batch: any) => {
            batch.casings?.forEach(
              (casing: any) => {
                transformed.push({
                  id:
                    casing.orderCasingId,

                  orderCasingId:
                    casing.orderCasingId,

                  casing:
                    casing.productionNumber,

                  serial:
                    casing.tyreReferenceNumber,

                  date:
                    casing.orderDate,

                  customerName:
                    casing.customerName,

                  patternName:
                    casing.patternName ||
                    "-",

                  tyreSize:
                    casing.tyreSizeLabel,

                  service:
                    batch.batchNumber.startsWith(
                      "RT"
                    )
                      ? "Retread"
                      : "Repair",

                  batchNo:
                    batch.batchNumber,

                  approved:
                    batch.stageSummary
                      .approved,

                  rejected:
                    batch.stageSummary
                      .rejected,

                  pending:
                    batch.stageSummary
                      .pending,

                  expectedTotal:
                    batch.stageSummary
                      .expectedTotal,

                  originalBatch:
                    batch,

                  originalCasing:
                    casing,
                    requestedPattern:casing.patternName ||
                    "-",
                });
              }
            );
          }
        );
      });

      setFillUpData(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFillUpOrders();
  }, []);

  const filteredData = useMemo(() => {
    return fillUpData.filter(
      (item) =>
        `${item.casing}
         ${item.serial}
         ${item.patternName}
         ${item.customerName}
         ${item.batchNo}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }, [search, fillUpData]);

  return {
    loading,

    search,
    setSearch,

    fillUpData,
    filteredData,

    loadFillUpOrders,
  };
};

export default useFillUpIndexTable;