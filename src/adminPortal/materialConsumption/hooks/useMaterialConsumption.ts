import { useCallback, useEffect, useState } from "react";

import materialConsumptionApiService from "../services/materialConsumptionApiService";

import type {
  MaterialConsumption,
} from "../types/materialConsumption.type";

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
   * FETCH MATERIAL CONSUMPTION
   * ==========================================================
   */

  const fetchMaterialConsumption = useCallback(
    async (
      page: number = currentPage,
      size: number = pageSize
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await materialConsumptionApiService
            .getMaterialConsumptionApprovals(
              page,
              size
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
    [currentPage, pageSize]
  );

  /*
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(() => {
    fetchMaterialConsumption(
      currentPage,
      pageSize
    );
  }, [currentPage, pageSize]);

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

    goToPage,
    changePageSize,

    refetch: () =>
      fetchMaterialConsumption(
        currentPage,
        pageSize
      ),
  };
};

export default useMaterialConsumption;