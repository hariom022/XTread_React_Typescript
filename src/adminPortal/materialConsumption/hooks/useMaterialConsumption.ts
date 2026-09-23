
import { useCallback, useEffect, useState } from "react";

import materialConsumptionApiService from "../services/materialConsumptionApiService";

import type {
  MaterialConsumption,
} from "../types/materialConsumption.type";

export type MaterialConsumptionStatus =
  | "all"
  | "pending"
  | "approved";

const useMaterialConsumption = () => {
  /*
   * ==========================================================
   * DATA
   * ==========================================================
   */

  const [data, setData] = useState<MaterialConsumption[]>([]);

  /*
   * ==========================================================
   * LOADING / ERROR
   * ==========================================================
   */

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageSize, setPageSize] = useState<number>(10);

  const [totalCount, setTotalCount] = useState<number>(0);

  const [totalPages, setTotalPages] = useState<number>(0);

  /*
   * ==========================================================
   * STATUS FILTER
   * ==========================================================
   *
   * all      -> isApproved is not sent
   * pending  -> isApproved=false
   * approved -> isApproved=true
   *
   * Default = all
   */

  const [status, setStatus] =
    useState<MaterialConsumptionStatus>("pending");

  /*
   * ==========================================================
   * CONVERT STATUS TO API VALUE
   * ==========================================================
   */

  const getIsApproved = (
    selectedStatus: MaterialConsumptionStatus
  ): boolean | undefined => {
    if (selectedStatus === "pending") {
      return false;
    }

    if (selectedStatus === "approved") {
      return true;
    }

    return undefined;
  };

  /*
   * ==========================================================
   * FETCH MATERIAL CONSUMPTION
   * ==========================================================
   */

  const fetchMaterialConsumption = useCallback(
    async (
      page: number = currentPage,
      size: number = pageSize,
      selectedStatus: MaterialConsumptionStatus = status
    ) => {
      try {
        setLoading(true);
        setError("");

        const isApproved = getIsApproved(selectedStatus);

        console.log("Material Consumption API Filter:", {
          status: selectedStatus,
          isApproved,
          page,
          pageSize: size,
        });

        const response =
          await materialConsumptionApiService.getMaterialConsumptionApprovals(
            page,
            size,
            isApproved
          );

        setData(response.items || []);

        setCurrentPage(response.pageNumber || page);

        setPageSize(response.pageSize || size);

        setTotalCount(response.totalCount || 0);

        setTotalPages(response.totalPages || 0);
      } catch (err) {
        console.error(
          "Failed to fetch material consumption:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch Material Consumption."
        );

        setData([]);

        setTotalCount(0);

        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, status]
  );

  /*
   * ==========================================================
   * INITIAL LOAD / PAGINATION / STATUS CHANGE
   * ==========================================================
   */

  useEffect(() => {
    fetchMaterialConsumption(
      currentPage,
      pageSize,
      status
    );
  }, [
    currentPage,
    pageSize,
    status,
  ]);

  /*
   * ==========================================================
   * CHANGE STATUS
   * ==========================================================
   */

  const changeStatus = (
    newStatus: MaterialConsumptionStatus
  ) => {
    setStatus(newStatus);

    /*
     * Always start from page 1 when filter changes.
     */
    setCurrentPage(1);
  };

  /*
   * ==========================================================
   * CHANGE PAGE
   * ==========================================================
   */

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      (totalPages > 0 && page > totalPages)
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /*
   * ==========================================================
   * CHANGE PAGE SIZE
   * ==========================================================
   */

  const changePageSize = (size: number) => {
    setPageSize(size);

    setCurrentPage(1);
  };

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    data,
    loading,
    error,

    currentPage,
    pageSize,
    totalCount,
    totalPages,

    status,

    goToPage,
    changePageSize,
    changeStatus,

    refetch: () =>
      fetchMaterialConsumption(
        currentPage,
        pageSize,
        status
      ),
  };
};

export default useMaterialConsumption;

