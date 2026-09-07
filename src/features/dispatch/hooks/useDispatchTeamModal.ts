import { useState } from "react";

import type {
  CourierService,
  CourierVehicle,
  AddCourierPayload,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";

const useDispatchTeamModal = () => {
  // =========================================================
  // COMMON
  // =========================================================

  const [activeTab, setActiveTab] =
    useState<"add" | "select">("add");

  // =========================================================
  // SELECT COURIER
  // =========================================================

  const [courierType, setCourierType] =
    useState("");

  // 1 = External
  // 2 = Internal
  const [selectedCourierType, setSelectedCourierType] =
    useState<number | null>(null);

  // =========================================================
  // ADD COURIER
  // =========================================================

  const [courierList, setCourierList] =
    useState<CourierService[]>([]);

  const [loadingCourierServices, setLoadingCourierServices] =
    useState(false);

  const [addCourierId, setAddCourierId] =
    useState<number | null>(null);

  const [addVehicleList, setAddVehicleList] =
    useState<CourierVehicle[]>([]);

  const [addSelectedVehicle, setAddSelectedVehicle] =
    useState<CourierVehicle | null>(null);

  const [driverName, setDriverName] =
    useState("");

  const [driverId, setDriverId] =
    useState("");

  const [loadingAddVehicles, setLoadingAddVehicles] =
    useState(false);

  const [savingCourier, setSavingCourier] =
    useState(false);

  // =========================================================
  // GET COURIER SERVICES FOR ADD COURIER
  // =========================================================

  const courierServiceList = async () => {
    try {
      setLoadingCourierServices(true);

      // Add Courier is using all/required services.
      // If your backend requires a type here,
      // pass the appropriate type.
      const response =
        await dispatchServiceApi.getCourierServices(1);

      console.log(
        "========== ADD COURIER SERVICE API ==========",
      );

      console.log(
        "Courier Service Response:",
        response.data,
      );

      if (response.data?.success) {
        setCourierList(
          Array.isArray(response.data.data)
            ? response.data.data
            : [],
        );
      } else {
        setCourierList([]);
      }
    } catch (error) {
      console.error(
        "Error fetching courier services:",
        error,
      );

      setCourierList([]);
    } finally {
      setLoadingCourierServices(false);
    }
  };

  // =========================================================
  // GET VEHICLES FOR ADD COURIER
  // =========================================================

  const getAddVehicles = async (
    courierServiceId: number,
  ) => {
    try {
      setLoadingAddVehicles(true);

      setAddVehicleList([]);
      setAddSelectedVehicle(null);

      const response =
        await dispatchServiceApi.getVehicleByCourierServiceId(
          courierServiceId,
        );

      console.log(
        "ADD COURIER VEHICLES:",
        response.data,
      );

      if (response.data?.success) {
        setAddVehicleList(
          Array.isArray(response.data.data)
            ? response.data.data
            : [],
        );
      } else {
        setAddVehicleList([]);
      }
    } catch (error) {
      console.error(
        "Error fetching add courier vehicles:",
        error,
      );

      setAddVehicleList([]);
    } finally {
      setLoadingAddVehicles(false);
    }
  };

  // =========================================================
  // ADD COURIER SERVICE CHANGE
  // =========================================================

  const handleAddCourierServiceChange = async (
    courierServiceId: number | null,
  ) => {
    setAddCourierId(courierServiceId);

    setAddSelectedVehicle(null);
    setAddVehicleList([]);

    if (!courierServiceId) {
      return;
    }

    await getAddVehicles(courierServiceId);
  };

  // =========================================================
  // ADD COURIER
  // =========================================================

  const addCourier = async () => {
    if (!addCourierId) {
      alert("Please select Courier Service");
      return false;
    }

    if (!addSelectedVehicle) {
      alert("Please select Vehicle Reg No");
      return false;
    }

    if (!driverName.trim()) {
      alert("Please enter Driver Name");
      return false;
    }

    if (!driverId.trim()) {
      alert("Please enter Driver ID");
      return false;
    }

    const payload: AddCourierPayload = {
      vehicleRegNo:
        addSelectedVehicle.vehicleRegNo,

      driverName:
        driverName.trim(),

      driverIdNo:
        driverId.trim(),
    };

    console.log(
      "ADD COURIER PAYLOAD:",
      payload,
    );

    try {
      setSavingCourier(true);

      const response =
        await dispatchServiceApi.saveCourier(
          payload,
          addCourierId,
        );

      console.log(
        "ADD COURIER RESPONSE:",
        response.data,
      );

      if (response.data?.success) {
        alert(
          "Courier added successfully",
        );

        await getAddVehicles(
          addCourierId,
        );

        setAddSelectedVehicle(null);
        setDriverName("");
        setDriverId("");

        return true;
      }

      alert(
        response.data?.error ||
          "Failed to add courier",
      );

      return false;
    } catch (error) {
      console.error(
        "Error adding courier:",
        error,
      );

      alert(
        "Failed to add courier",
      );

      return false;
    } finally {
      setSavingCourier(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setActiveTab("add");

    // Select Courier
    setCourierType("");
    setSelectedCourierType(null);

    // Add Courier
    setCourierList([]);
    setAddCourierId(null);
    setAddVehicleList([]);
    setAddSelectedVehicle(null);
    setDriverName("");
    setDriverId("");
  };

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // COMMON
    activeTab,
    setActiveTab,

    // SELECT COURIER
    courierType,
    setCourierType,

    selectedCourierType,
    setSelectedCourierType,

    // ADD COURIER
    courierList,
    loadingCourierServices,

    courierServiceList,

    addCourierId,
    setAddCourierId,

    addVehicleList,
    setAddVehicleList,

    addSelectedVehicle,
    setAddSelectedVehicle,

    loadingAddVehicles,

    handleAddCourierServiceChange,

    driverName,
    setDriverName,

    driverId,
    setDriverId,

    savingCourier,

    addCourier,

    // RESET
    reset,
  };
};

export default useDispatchTeamModal;