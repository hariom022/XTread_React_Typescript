import {
  useCallback,
  useEffect,
  useState,
} from "react";

import driversApiService from "../services/driversApiService";

import type {
  CourierService,
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "../types/drivers.type";

const useDrivers = (
  courierServiceId: number | null
) => {
  const [drivers, setDrivers] = useState<Driver[]>(
    []
  );

  const [
    courierServices,
    setCourierServices,
  ] = useState<CourierService[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [
    courierServicesLoading,
    setCourierServicesLoading,
  ] = useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [
    courierServiceError,
    setCourierServiceError,
  ] = useState<string>("");

  const [submitting, setSubmitting] =
    useState<boolean>(false);

  /*
   * ==========================================================
   * FETCH COURIER SERVICES
   *
   * GET /courier-services?courierType=2
   * ==========================================================
   */

  const fetchCourierServices =
    useCallback(async () => {
      try {
        setCourierServicesLoading(true);
        setCourierServiceError("");

        const data =
          await driversApiService.getCourierServices();

        setCourierServices(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch courier services.";

        setCourierServiceError(message);
      } finally {
        setCourierServicesLoading(false);
      }
    }, []);

  /*
   * ==========================================================
   * FETCH DRIVERS
   * ==========================================================
   */

  const fetchDrivers =
    useCallback(async () => {
      /*
       * No courier service selected
       */

      if (!courierServiceId) {
        setDrivers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await driversApiService.getDrivers(
            courierServiceId
          );

        setDrivers(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch drivers.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }, [courierServiceId]);

  /*
   * ==========================================================
   * LOAD COURIER SERVICES ON PAGE LOAD
   * ==========================================================
   */

  useEffect(() => {
    fetchCourierServices();
  }, [fetchCourierServices]);

  /*
   * ==========================================================
   * LOAD DRIVERS WHEN COURIER SERVICE CHANGES
   * ==========================================================
   */

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  /*
   * ==========================================================
   * GET DRIVER BY ID
   * ==========================================================
   */

  const getDriverById = async (
    driverId: number
  ): Promise<Driver> => {
    return driversApiService.getDriverById(
      driverId
    );
  };

  /*
   * ==========================================================
   * CREATE
   * ==========================================================
   */

  const createDriver = async (
    request: CreateDriverRequest
  ): Promise<Driver> => {
    try {
      setSubmitting(true);
      setError("");

      const createdDriver =
        await driversApiService.createDriver(
          request
        );

      /*
       * Refresh drivers
       */

      await fetchDrivers();

      return createdDriver;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create driver.";

      setError(message);

      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ==========================================================
   * UPDATE
   * ==========================================================
   */

  const updateDriver = async (
    driverId: number,
    request: UpdateDriverRequest
  ): Promise<Driver> => {
    try {
      setSubmitting(true);
      setError("");

      const updatedDriver =
        await driversApiService.updateDriver(
          driverId,
          request
        );

      /*
       * Refresh drivers
       */

      await fetchDrivers();

      return updatedDriver;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update driver.";

      setError(message);

      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ==========================================================
   * DELETE
   * ==========================================================
   */

  const deleteDriver = async (
    driverId: number
  ): Promise<void> => {
    try {
      setSubmitting(true);
      setError("");

      await driversApiService.deleteDriver(
        driverId
      );

      /*
       * Refresh drivers
       */

      await fetchDrivers();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete driver.";

      setError(message);

      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ==========================================================
   * RELOAD
   * ==========================================================
   */

  const reload = async () => {
    await fetchDrivers();
  };

  return {
    drivers,

    courierServices,

    loading,
    courierServicesLoading,

    error,
    courierServiceError,

    submitting,

    getDriverById,

    createDriver,
    updateDriver,
    deleteDriver,

    reload,
  };
};

export default useDrivers;