import { useState } from "react";

import type {Courier,ExistingCourier,} from "../type/dispatch.types";

const useDispatchTeamModal =
  () => {
    const [activeTab,setActiveTab,] = useState<"add" | "select">("add");

    const [courierType,setCourierType,] = useState("");

    const [selectedCourierId,setSelectedCourierId,] =useState<number | null>(null);

    const [selectedVehicle,setSelectedVehicle,] = useState("");

    const [driverName, setDriverName,] = useState("");

    const [driverId,setDriverId,] = useState("");

    const [selectedCourier,setSelectedCourier,] = useState< Courier | null>(null);

    const courierList: Courier[] =
      [
        {
          id: 1,
          name: "DHL Express",
          vehicles: [
            "UP78 AB1234",
            "UP78 XY5678",
          ],
        },

        {
          id: 2,
          name: "Blue Dart",
          vehicles: [
            "DL01 XY5678",
            "DL01 ZZ9999",
          ],
        },

        {
          id: 3,
          name: "FedEx",
          vehicles: ["MH12 CD9012",],
        },

        {
          id: 4,
          name: "DTDC",
          vehicles: ["KA05 EF3456",],
        },
      ];

    const existingCouriers: ExistingCourier[] =
      [
        {
          id: 1,
          name: "DHL Express",
          regNo:"UP78 AB1234",
          driver:"Ravi Kumar",
        },

        {
          id: 2,
          name: "Blue Dart",
          regNo:"DL01 XY5678",
          driver:"Arun",
        },

        {
          id: 3,
          name: "FedEx",
          regNo:"MH12 CD9012",
          driver:"Suresh",
        },
      ];

    const reset =
      () => {
        setActiveTab("add");

        setCourierType("");

        setSelectedCourierId(null);

        setSelectedCourier(null);

        setSelectedVehicle("");

        setDriverName("");

        setDriverId("");
      };

    return {
      activeTab,
      setActiveTab,

      courierType,
      setCourierType,

      selectedCourierId,
      setSelectedCourierId,

      selectedCourier,
      setSelectedCourier,

      selectedVehicle,
      setSelectedVehicle,

      driverName,
      setDriverName,

      driverId,
      setDriverId,

      courierList,
      existingCouriers,

      reset,
    };
  };

export default useDispatchTeamModal;