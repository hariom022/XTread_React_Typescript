import { useEffect, useState } from "react";
import serviceTypeService from "../service/serviceTypeService";
import type { ServiceType } from "../types/serviceType.types";

const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState<
    ServiceType[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // LOAD SERVICE TYPES
  // =========================

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await serviceTypeService.getAllServiceTypes();

      console.log(
        "Service Types API Response:",
        response.data
      );

      if (response.data?.success) {
        setServiceTypes(response.data.data || []);
      } else {
        setServiceTypes([]);

        setError(
          response.data?.error?.message ||
            "Failed to load service types"
        );
      }
    } catch (err: any) {
      console.error(
        "Service Types API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load service types"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadServiceTypes();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredServiceTypes =
    serviceTypes.filter((serviceType) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      return (
        serviceType.serviceTypeName
          ?.toLowerCase()
          .includes(search) ||
        serviceType.serviceTypeCode
          ?.toLowerCase()
          .includes(search) ||
        serviceType.serviceTypeId
          .toString()
          .includes(search)
      );
    });

  return {
    serviceTypes,
    filteredServiceTypes,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    loadServiceTypes,
  };
};

export default useServiceTypes;