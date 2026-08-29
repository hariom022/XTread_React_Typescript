import { useEffect, useState } from "react";

import type {
  CourierService,
  CourierVehicle,
  AddCourierPayload,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";

const useDispatchTeamModal = () => {

  const [activeTab, setActiveTab] = useState<"add" | "select">("add");

  const [courierType, setCourierType] = useState("");

  // Courier services
  const [courierList, setCourierList] = useState<CourierService[]>([]);

  // Selected courier service
  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(null);

  // Vehicles belonging to selected courier service
  const [vehicleList, setVehicleList] = useState<CourierVehicle[]>([]);

  // Selected vehicle
  const [selectedVehicle, setSelectedVehicle] = useState<CourierVehicle | null>(null);

  // Add Courier fields
  const [driverName, setDriverName] = useState("");

  const [driverId, setDriverId] = useState("");

  const [vehicleRegNo, setVehicleRegNo] = useState("");

  const [loadingCourierServices, setLoadingCourierServices] = useState(false);

  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [savingCourier, setSavingCourier] = useState(false);


  // ==========================================
  // GET COURIER SERVICES
  // ==========================================

  useEffect(() => {
    courierServiceList();
  }, []);

  const courierServiceList = async () => {
    try {
      setLoadingCourierServices(true);

      const response =
        await dispatchServiceApi.getCourierServices();

      console.log("========== COURIER SERVICE API ==========");

      console.log(
        "Full response:",
        response
      );

      console.log(
        "response.data:",
        response?.data
      );

      console.log(
        "response.data.data:",
        response?.data?.data
      );

      console.log(
        "=========================================="
      );

      const apiData = response?.data;

      if (apiData?.success === true) {

        setCourierList(
          Array.isArray(apiData.data)
            ? apiData.data
            : []
        );

      } else {

        console.error(
          "Courier Service API did not return success=true",
          apiData
        );

        setCourierList([]);
      }

    } catch (error) {

      console.error(
        "Error fetching courier services:",
        error
      );

      setCourierList([]);

    } finally {

      setLoadingCourierServices(false);
    }
  };

  // ==========================================
  // GET VEHICLES BY COURIER SERVICE
  // ==========================================

  const getVehicles = async (
    courierServiceId: number
  ) => {

    try {

      setLoadingVehicles(true);

      setVehicleList([]);
      setSelectedVehicle(null);

      const response =
        await dispatchServiceApi
          .getVehicleByCourierServiceId(
            courierServiceId
          );

      console.log(
        "Vehicle API Response:",
        response.data
      );

      if (response.data?.success) {

        setVehicleList(
          response.data.data ?? []
        );

      } else {

        setVehicleList([]);
      }

    } catch (error) {

      console.error(
        "Error fetching courier vehicles:",
        error
      );

      setVehicleList([]);

    } finally {

      setLoadingVehicles(false);
    }
  };


  // ==========================================
  // COURIER SERVICE CHANGE
  // ==========================================

  const handleCourierServiceChange = async (
    courierServiceId: number | null
  ) => {

    setSelectedCourierId(courierServiceId);

    setSelectedVehicle(null);

    setVehicleList([]);

    if (!courierServiceId) {
      return;
    }

    await getVehicles(courierServiceId);
  };


  // ==========================================
  // ADD COURIER
  // ==========================================
  const addCourier = async () => {

    if (!selectedCourierId) {
      alert("Please select Courier Service");
      return false;
    }

    if (!selectedVehicle) {
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

      // Vehicle Reg No comes from selected dropdown vehicle
      vehicleRegNo: selectedVehicle.vehicleRegNo,

      // Driver details are entered manually by user
      driverName: driverName.trim(),

      driverIdNo: driverId.trim(),
    };

    console.log(
      "ADD COURIER PAYLOAD:",
      payload
    );

    try {

      setSavingCourier(true);

      const response =
        await dispatchServiceApi.saveCourier(
          payload,
          selectedCourierId
        );

      console.log(
        "ADD COURIER RESPONSE:",
        response.data
      );

      if (response.data?.success) {

        alert("Courier added successfully");

        // Refresh vehicles
        await getVehicles(
          selectedCourierId
        );

        // Clear selected vehicle
        setSelectedVehicle(null);

        // Clear manually entered driver details
        setDriverName("");
        setDriverId("");

        return true;
      }

      alert(
        response.data?.error ||
        "Failed to add courier"
      );

      return false;

    } catch (error) {

      console.error(
        "Error adding courier:",
        error
      );

      alert("Failed to add courier");

      return false;

    } finally {

      setSavingCourier(false);
    }
  };
  // ==========================================
  // RESET
  // ==========================================

  const reset = () => {

    setActiveTab("add");

    setCourierType("");

    setSelectedCourierId(null);

    setVehicleList([]);

    setSelectedVehicle(null);

    setVehicleRegNo("");

    setDriverName("");

    setDriverId("");
  };


  return {

    activeTab,
    setActiveTab,

    courierType,
    setCourierType,

    courierList,

    selectedCourierId,
    setSelectedCourierId,

    vehicleList,
    setVehicleList,

    selectedVehicle,
    setSelectedVehicle,

    vehicleRegNo,
    setVehicleRegNo,

    driverName,
    setDriverName,

    driverId,
    setDriverId,

    loadingCourierServices,

    loadingVehicles,

    savingCourier,

    handleCourierServiceChange,

    addCourier,

    reset,
  };
};

export default useDispatchTeamModal;