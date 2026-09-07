import { useEffect, useState } from "react";

import type {
  Customer,
  CustomerCasing,
  DispatchTeam,
  ServiceType,
  CourierService,
  CourierDriver,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";

const useCustomerDeliveryOrderModal = (
  dispatchTeam: DispatchTeam,
  isInternal: boolean,
  setDispatchTeam: React.Dispatch<
    React.SetStateAction<DispatchTeam>
  >,
) => {
  // ==========================================
  // COURIER SERVICES
  // ==========================================

  const [courierServices, setCourierServices] =
    useState<CourierService[]>([]);

  const [loadingCourierServices, setLoadingCourierServices] =
    useState(false);

  const [
    selectedCourierServiceId,
    setSelectedCourierServiceId,
  ] = useState<number | null>(
    dispatchTeam.courierServiceId
      ? Number(dispatchTeam.courierServiceId)
      : null,
  );

  // ==========================================
  // GET COURIER SERVICES
  // ==========================================

  const getCourierServices = async (
    courierType: number,
  ) => {
    try {
      setLoadingCourierServices(true);

      console.log(
        "Loading Courier Services. Type:",
        courierType,
      );

      const response =
        await dispatchServiceApi.getCourierServices(
          courierType,
        );

      console.log(
        "Courier Services Response:",
        response.data,
      );

      if (response.data?.success) {
        const data = Array.isArray(
          response.data.data,
        )
          ? response.data.data
          : [];

        setCourierServices(data);
      } else {
        setCourierServices([]);
      }
    } catch (error) {
      console.error(
        "Error fetching courier services:",
        error,
      );

      setCourierServices([]);
    } finally {
      setLoadingCourierServices(false);
    }
  };

  // ==========================================
  // LOAD COURIER SERVICES
  // ==========================================

  useEffect(() => {
    const courierType = isInternal ? 2 : 1;

    getCourierServices(courierType);
  }, [isInternal]);

  // ==========================================
  // SYNC COURIER SERVICE FROM PARENT
  //
  // IMPORTANT FOR EDIT
  // ==========================================

  useEffect(() => {
    const courierServiceId =
      Number(
        dispatchTeam.courierServiceId,
      ) || 0;

    console.log(
      "Sync Courier Service ID:",
      courierServiceId,
    );

    if (courierServiceId > 0) {
      setSelectedCourierServiceId(
        courierServiceId,
      );
    } else {
      setSelectedCourierServiceId(null);
    }
  }, [
    dispatchTeam.courierServiceId,
  ]);

  // ==========================================
  // DRIVERS
  // ==========================================

  const [drivers, setDrivers] =
    useState<CourierDriver[]>([]);

  const [loadingDrivers, setLoadingDrivers] =
    useState(false);

  const [selectedDriverId, setSelectedDriverId] =
    useState<number | null>(null);

  // ==========================================
  // GET DRIVERS
  // ==========================================

  const getDrivers = async (
    courierServiceId: number,
  ) => {
    try {
      setLoadingDrivers(true);

      console.log(
        "========================================",
      );

      console.log(
        "GET DRIVERS",
      );

      console.log(
        "Courier Service ID:",
        courierServiceId,
      );

      console.log(
        "========================================",
      );

      const response =
        await dispatchServiceApi.getDriversByCourierServiceId(
          courierServiceId,
        );

      console.log(
        "Drivers API Response:",
        response.data,
      );

      if (response.data?.success) {
        const data = Array.isArray(
          response.data.data,
        )
          ? response.data.data
          : [];

        console.log(
          "Drivers Loaded:",
          data,
        );

        setDrivers(data);
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error(
        "Error fetching drivers:",
        error,
      );

      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // ==========================================
  // LOAD DRIVERS WHEN:
  //
  // 1. Internal Courier
  // 2. Courier Service Selected
  //
  // This also works during EDIT.
  // ==========================================

  useEffect(() => {
    if (
      !isInternal ||
      !selectedCourierServiceId
    ) {
      setDrivers([]);

      setSelectedDriverId(null);

      return;
    }

    console.log(
      "Auto loading drivers for Courier Service:",
      selectedCourierServiceId,
    );

    getDrivers(
      selectedCourierServiceId,
    );
  }, [
    isInternal,
    selectedCourierServiceId,
  ]);

  // ==========================================
  // SELECT EXISTING DRIVER DURING EDIT
  // ==========================================

  useEffect(() => {
    if (
      !isInternal ||
      drivers.length === 0
    ) {
      return;
    }

    const existingDriverId =
      Number(
        dispatchTeam.driverId,
      ) || 0;

    const existingDriverIdNo =
      dispatchTeam.driverIdNo
        ?.trim()
        .toLowerCase() || "";

    const existingDriverName =
      dispatchTeam.driverName
        ?.trim()
        .toLowerCase() || "";

    console.log(
      "========================================",
    );

    console.log(
      "SEARCHING EXISTING DRIVER",
    );

    console.log(
      "Existing Driver ID:",
      existingDriverId,
    );

    console.log(
      "Existing Driver ID No:",
      existingDriverIdNo,
    );

    console.log(
      "Existing Driver Name:",
      existingDriverName,
    );

    console.log(
      "Available Drivers:",
      drivers,
    );

    console.log(
      "========================================",
    );

    // ==========================================
    // FIRST: FIND BY DRIVER ID
    // ==========================================

    let existingDriver =
      drivers.find(
        (driver) =>
          Number(driver.driverId) ===
          existingDriverId,
      );

    // ==========================================
    // SECOND: FIND BY DRIVER ID NO
    // ==========================================

    if (
      !existingDriver &&
      existingDriverIdNo
    ) {
      existingDriver =
        drivers.find(
          (driver) =>
            driver.driverIdNo
              ?.trim()
              .toLowerCase() ===
            existingDriverIdNo,
        );
    }

    // ==========================================
    // THIRD: FIND BY DRIVER NAME
    // ==========================================

    if (
      !existingDriver &&
      existingDriverName
    ) {
      existingDriver =
        drivers.find(
          (driver) =>
            driver.driverName
              ?.trim()
              .toLowerCase() ===
            existingDriverName,
        );
    }

    console.log(
      "Existing Driver Found:",
      existingDriver,
    );

    if (!existingDriver) {
      return;
    }

    // ==========================================
    // SELECT DRIVER
    // ==========================================

    setSelectedDriverId(
      Number(existingDriver.driverId),
    );

    // ==========================================
    // ENSURE DISPATCH TEAM IS CORRECT
    // ==========================================

    setDispatchTeam((prev) => ({
      ...prev,

      driverId:
        Number(
          existingDriver!.driverId,
        ),

      driverName:
        existingDriver!.driverName ?? "",

      driverIdNo:
        existingDriver!.driverIdNo ?? "",
    }));
  }, [
    isInternal,
    drivers,
    dispatchTeam.driverId,
    dispatchTeam.driverIdNo,
    dispatchTeam.driverName,
    setDispatchTeam,
  ]);

  // ==========================================
  // SELECT DRIVER MANUALLY
  // ==========================================

  const handleDriverChange = (
    driverId: number | null,
  ) => {
    console.log(
      "Selected Driver ID:",
      driverId,
    );

    setSelectedDriverId(
      driverId,
    );

    if (!driverId) {
      setDispatchTeam((prev) => ({
        ...prev,

        driverId: 0,

        driverName: "",

        driverIdNo: "",
      }));

      return;
    }

    const selectedDriver =
      drivers.find(
        (driver) =>
          Number(driver.driverId) ===
          Number(driverId),
      );

    console.log(
      "Selected Driver:",
      selectedDriver,
    );

    if (!selectedDriver) {
      return;
    }

    setDispatchTeam((prev) => ({
      ...prev,

      driverId:
        Number(
          selectedDriver.driverId,
        ),

      driverName:
        selectedDriver.driverName ??
        "",

      driverIdNo:
        selectedDriver.driverIdNo ??
        "",
    }));
  };

  // ==========================================
  // DELIVERY DATE
  // ==========================================

  const [deliveryDate, setDeliveryDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0],
    );

  // ==========================================
  // SERVICE TYPE
  // ==========================================

  const [serviceType, setServiceType] =
    useState("");

  const [serviceTypes, setServiceTypes] =
    useState<ServiceType[]>([]);

  const [loadingServiceTypes, setLoadingServiceTypes] =
    useState(false);

  // ==========================================
  // CUSTOMER
  // ==========================================

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [
    selectedCustomerId,
    setSelectedCustomerId,
  ] = useState("");

  const [loadingCustomers, setLoadingCustomers] =
    useState(false);

  // ==========================================
  // QC CASINGS
  // ==========================================

  const [batchCasings, setBatchCasings] =
    useState<CustomerCasing[]>([]);

  const [loadingBatchCasings, setLoadingBatchCasings] =
    useState(false);

  // ==========================================
  // AVAILABLE CASINGS
  // ==========================================

  const [
    availableCasings,
    setAvailableCasings,
  ] = useState<CustomerCasing[]>([]);

  // ==========================================
  // SELECTED CASINGS
  // ==========================================

  const [
    selectedCasings,
    setSelectedCasings,
  ] = useState<CustomerCasing[]>([]);

  // ==========================================
  // ORIGINAL EDIT CASING IDS
  // ==========================================

  const [
    originalEditCasingIds,
    setOriginalEditCasingIds,
  ] = useState<number[]>([]);

  // ==========================================
  // GET CUSTOMERS
  // ==========================================

  const getCustomers = async () => {
    try {
      setLoadingCustomers(true);

      const response =
        await dispatchServiceApi.getCustomerName();

      console.log(
        "Customers API Response:",
        response.data,
      );

      if (response.data?.success) {
        setCustomers(
          Array.isArray(
            response.data.data,
          )
            ? response.data.data
            : [],
        );
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error,
      );

      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // ==========================================
  // GET SERVICE TYPES
  // ==========================================

  const getServiceTypes = async () => {
    try {
      setLoadingServiceTypes(true);

      const response =
        await dispatchServiceApi.getServiceTypeName();

      console.log(
        "Service Types API Response:",
        response.data,
      );

      if (response.data?.success) {
        setServiceTypes(
          Array.isArray(
            response.data.data,
          )
            ? response.data.data
            : [],
        );
      } else {
        setServiceTypes([]);
      }
    } catch (error) {
      console.error(
        "Error fetching service types:",
        error,
      );

      setServiceTypes([]);
    } finally {
      setLoadingServiceTypes(false);
    }
  };

  // ==========================================
  // GET APPROVED CASINGS FROM QC
  // ==========================================

  const getApprovedCasingsFromQC =
    async () => {
      try {
        setLoadingBatchCasings(true);

        console.log(
          "Getting approved casings from QC...",
        );

        const response =
          await dispatchServiceApi.getApprovedFromQC();

        console.log(
          "Approved From QC API Response:",
          response.data,
        );

        if (!response.data?.success) {
          setBatchCasings([]);

          return;
        }

        const stages =
          Array.isArray(
            response.data.data,
          )
            ? response.data.data
            : [];

        const casings: CustomerCasing[] =
          stages.flatMap(
            (stage: any) => {
              if (
                !Array.isArray(
                  stage.batches,
                )
              ) {
                return [];
              }

              return stage.batches.flatMap(
                (batch: any) => {
                  if (
                    !Array.isArray(
                      batch.casings,
                    )
                  ) {
                    return [];
                  }

                  return batch.casings.map(
                    (casing: any) => ({
                      orderCasingId:
                        casing.orderCasingId,

                      customerName:
                        casing.customerName ??
                        "",

                      batchNo:
                        casing.batchNumber ??
                        batch.batchNumber ??
                        "",

                      productionNo:
                        casing.productionNumber ??
                        "",

                      tyreSize:
                        casing.tyreSizeLabel ??
                        "",

                      tyreMake:
                        casing.tyreMakeName ??
                        "",

                      service:
                        casing.serviceType ??
                        casing.serviceTypeName ??
                        "",
                    }),
                  );
                },
              );
            },
          );

        console.log(
          "Flattened QC Casings:",
          casings,
        );

        setBatchCasings(casings);
      } catch (error) {
        console.error(
          "Error fetching approved casings from QC:",
          error,
        );

        setBatchCasings([]);
      } finally {
        setLoadingBatchCasings(false);
      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    getCustomers();

    getServiceTypes();

    getApprovedCasingsFromQC();
  }, []);

  // ==========================================
  // SELECTED CUSTOMER
  // ==========================================

  const selectedCustomer =
    customers.find(
      (customer) =>
        customer.customerNumber ===
        selectedCustomerId,
    );

  // ==========================================
  // SELECTED SERVICE TYPE
  // ==========================================

  const selectedServiceType =
    serviceTypes.find(
      (item) =>
        item.serviceTypeId.toString() ===
        serviceType,
    );

  // ==========================================
  // FILTER LEFT TABLE
  // ==========================================

  useEffect(() => {
    if (
      !selectedCustomer ||
      !selectedServiceType
    ) {
      setAvailableCasings([]);

      return;
    }

    const customerName =
      selectedCustomer.customerName
        ?.trim()
        .toLowerCase();

    const serviceTypeName =
      selectedServiceType.serviceTypeName
        ?.trim()
        .toLowerCase();

    const filteredCasings =
      batchCasings.filter(
        (casing) => {
          const casingCustomerName =
            casing.customerName
              ?.trim()
              .toLowerCase();

          const casingServiceType =
            casing.service
              ?.trim()
              .toLowerCase();

          const alreadySelected =
            selectedCasings.some(
              (selected) =>
                selected.orderCasingId ===
                casing.orderCasingId,
            );

          return (
            casingCustomerName ===
              customerName &&
            casingServiceType ===
              serviceTypeName &&
            !alreadySelected
          );
        },
      );

    setAvailableCasings(
      filteredCasings,
    );
  }, [
    selectedCustomer,
    selectedCustomerId,
    selectedServiceType,
    serviceType,
    batchCasings,
    selectedCasings,
  ]);

  // ==========================================
  // ADD CASING
  // ==========================================

  const handleAddCasing = (
    item: CustomerCasing,
  ) => {
    setSelectedCasings((prev) => {
      const exists = prev.some(
        (x) =>
          x.orderCasingId ===
          item.orderCasingId,
      );

      if (exists) {
        return prev;
      }

      return [...prev, item];
    });

    setAvailableCasings((prev) =>
      prev.filter(
        (x) =>
          x.orderCasingId !==
          item.orderCasingId,
      ),
    );
  };

  // ==========================================
  // REMOVE CASING
  // ==========================================

  const handleRemoveCasing = (
    item: CustomerCasing,
  ) => {
    setSelectedCasings((prev) =>
      prev.filter(
        (x) =>
          x.orderCasingId !==
          item.orderCasingId,
      ),
    );

    setAvailableCasings((prev) => {
      const exists = prev.some(
        (x) =>
          x.orderCasingId ===
          item.orderCasingId,
      );

      if (exists) {
        return prev;
      }

      return [...prev, item];
    });
  };

  // ==========================================
  // LOAD EXISTING CASINGS FOR EDIT
  // ==========================================

  const loadEditCasings = (
    casings: any[],
  ) => {
    console.log(
      "========================================",
    );

    console.log(
      "LOADING EDIT CASINGS:",
      casings,
    );

    console.log(
      "========================================",
    );

    if (
      !Array.isArray(casings)
    ) {
      setSelectedCasings([]);

      setOriginalEditCasingIds([]);

      return;
    }

    // ==========================================
    // MAP EXISTING CASINGS
    // ==========================================

    const mappedCasings: CustomerCasing[] =
      casings.map(
        (casing: any) => ({
          orderCasingId:
            Number(
              casing.orderCasingId,
            ),

          customerName:
            casing.customerName ??
            "",

          service:
            casing.serviceType ??
            casing.serviceTypeName ??
            "",

          batchNo:
            casing.batchNumber ??
            "",

          productionNo:
            casing.productionNumber ??
            "",

          tyreSize:
            casing.tyreSizeLabel ??
            "",

          tyreMake:
            casing.tyreMakeName ??
            "",
        }),
      );

    console.log(
      "Mapped Edit Casings:",
      mappedCasings,
    );

    // ==========================================
    // ORIGINAL IDS
    // ==========================================

    const originalIds =
      mappedCasings.map(
        (item) =>
          item.orderCasingId,
      );

    setOriginalEditCasingIds(
      originalIds,
    );

    // ==========================================
    // MERGE INTO BATCH CASINGS
    // ==========================================

    setBatchCasings((prev) => {
      const existingIds =
        new Set(
          prev.map(
            (x) =>
              x.orderCasingId,
          ),
        );

      const newCasings =
        mappedCasings.filter(
          (item) =>
            !existingIds.has(
              item.orderCasingId,
            ),
        );

      return [
        ...prev,
        ...newCasings,
      ];
    });

    // ==========================================
    // SHOW EXISTING CASINGS ON RIGHT
    // ==========================================

    setSelectedCasings(
      mappedCasings,
    );
  };

  // ==========================================
  // GET UPDATE CASING IDS
  // ==========================================

  const getUpdateCasingIds = () => {
    const currentIds =
      selectedCasings.map(
        (item) =>
          item.orderCasingId,
      );

    const addOrderCasingIds =
      currentIds.filter(
        (id) =>
          !originalEditCasingIds.includes(
            id,
          ),
      );

    const removeOrderCasingIds =
      originalEditCasingIds.filter(
        (id) =>
          !currentIds.includes(
            id,
          ),
      );

    return {
      addOrderCasingIds,
      removeOrderCasingIds,
    };
  };

  // ==========================================
  // GENERATE DO NUMBER
  // ==========================================

  const generateDONumber = () => {
    const random =
      Math.floor(
        100 + Math.random() * 900,
      );

    return `DEV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${random}`;
  };

  // ==========================================
  // RESET
  // ==========================================

  const reset = () => {
    setDeliveryDate(
      new Date()
        .toISOString()
        .split("T")[0],
    );

    setSelectedCustomerId("");

    setServiceType("");

    setAvailableCasings([]);

    setSelectedCasings([]);

    setOriginalEditCasingIds([]);

    // Courier

    setCourierServices([]);

    setSelectedCourierServiceId(
      null,
    );

    // Drivers

    setDrivers([]);

    setSelectedDriverId(null);
  };

  // ==========================================
  // RETURN
  // ==========================================

  return {
    // DATE
    deliveryDate,
    setDeliveryDate,

    // SERVICE
    serviceType,
    setServiceType,

    serviceTypes,
    loadingServiceTypes,

    // CUSTOMER
    selectedCustomerId,
    setSelectedCustomerId,

    customers,
    selectedCustomer,
    loadingCustomers,

    // CASINGS
    batchCasings,
    loadingBatchCasings,

    availableCasings,

    selectedCasings,

    handleAddCasing,

    handleRemoveCasing,

    loadEditCasings,

    getUpdateCasingIds,

    generateDONumber,

    // COURIER SERVICES
    courierServices,

    loadingCourierServices,

    selectedCourierServiceId,

    setSelectedCourierServiceId,

    // DRIVERS
    drivers,

    loadingDrivers,

    selectedDriverId,

    handleDriverChange,

    getDrivers,

    reset,

    dispatchTeam,
  };
};

export default useCustomerDeliveryOrderModal;