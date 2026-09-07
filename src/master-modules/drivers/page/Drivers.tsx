import { useEffect, useState } from "react";

import DriverForm from "../components/DriverForm";

import DriverTable from "../components/DriverTable";

import useDrivers from "../hooks/useDrivers";

import type {
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "../types/drivers.type";

const Drivers = () => {
  /*
   * ==========================================================
   * COURIER SERVICE
   * ==========================================================
   */

  const [selectedCourierServiceId, setSelectedCourierServiceId] = useState<
    number | null
  >(null);

  /*
   * ==========================================================
   * HOOK
   * ==========================================================
   */

  const {
    drivers,

    courierServices,

    loading,

    courierServicesLoading,

    error,

    courierServiceError,

    submitting,

    createDriver,

    updateDriver,

    deleteDriver,

    getDriverById,

    reload,
  } = useDrivers(selectedCourierServiceId);

  /*
   * ==========================================================
   * EDITING DRIVER
   * ==========================================================
   */

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  /*
   * ==========================================================
   * SEARCH
   * ==========================================================
   */

  const [searchTerm, setSearchTerm] = useState<string>("");

  /*
   * ==========================================================
   * SELECT FIRST COURIER SERVICE
   * ==========================================================
   *
   * After courier services are loaded, automatically select
   * the first active courier service.
   *
   * Example:
   *
   * AutoExpress = courierServiceId 1
   * ==========================================================
   */

  useEffect(() => {
    if (selectedCourierServiceId === null && courierServices.length > 0) {
      const activeService = courierServices.find((service) => service.isActive);

      if (activeService) {
        setSelectedCourierServiceId(activeService.courierServiceId);
      }
    }
  }, [courierServices, selectedCourierServiceId]);

  /*
   * ==========================================================
   * COURIER SERVICE CHANGE
   * ==========================================================
   */

  const handleCourierServiceChange = (courierServiceId: number) => {
    /*
     * If currently editing a driver,
     * don't allow changing service.
     */

    if (editingDriver) {
      return;
    }

    setSelectedCourierServiceId(courierServiceId);

    /*
     * Clear search when service changes
     */

    setSearchTerm("");
  };

  /*
   * ==========================================================
   * CREATE
   * ==========================================================
   */

  const handleCreate = async (request: CreateDriverRequest) => {
    await createDriver(request);

    /*
     * Return to Add mode
     */

    setEditingDriver(null);
  };

  /*
   * ==========================================================
   * EDIT
   * ==========================================================
   */

  const handleEdit = async (driver: Driver) => {
    try {
      /*
       * GET /drivers/:driverId
       */

      const details = await getDriverById(driver.driverId);

      /*
       * Set courier service from driver details.
       */

      setSelectedCourierServiceId(details.courierServiceId);

      /*
       * Set edit driver.
       */

      setEditingDriver(details);

      /*
       * Scroll to top.
       */

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Failed to load driver details:", err);
    }
  };

  /*
   * ==========================================================
   * UPDATE
   * ==========================================================
   */

  const handleUpdate = async (
    driverId: number,
    request: UpdateDriverRequest,
  ) => {
    await updateDriver(driverId, request);

    /*
     * Return to Add mode
     */

    setEditingDriver(null);
  };

  /*
   * ==========================================================
   * CANCEL EDIT
   * ==========================================================
   */

  const handleCancelEdit = () => {
    setEditingDriver(null);
  };

  /*
   * ==========================================================
   * DELETE
   * ==========================================================
   */

  const handleDelete = async (driver: Driver) => {
    try {
      await deleteDriver(driver.driverId);
    } catch (err) {
      console.error("Failed to delete driver:", err);
    }
  };

  return (
    <div
      className="container-fluid py-1"
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* =====================================================
          COURIER SERVICE ERROR
      ====================================================== */}

      {courierServiceError && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between mx-auto mb-3"
          style={{
            width: "calc(100% - 30px)",
          }}
        >
          <span>{courierServiceError}</span>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}

      <DriverForm
        courierServices={courierServices}
        courierServicesLoading={courierServicesLoading}
        selectedCourierServiceId={selectedCourierServiceId}
        onCourierServiceChange={handleCourierServiceChange}
        editingDriver={editingDriver}
        submitting={submitting}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancelEdit={handleCancelEdit}
      />

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between mx-auto mb-3"
          style={{
            width: "calc(100% - 30px)",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={reload}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      <DriverTable
        drivers={drivers}
        courierServices={courierServices}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default Drivers;
