import {
  useEffect,
  useState,
} from "react";

import type {
  Customer,
  CustomerCasing,
  DispatchTeam,
  ServiceType,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";


const useCustomerDeliveryOrderModal = (
  dispatchTeam: DispatchTeam,
) => {

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


  const [selectedCustomerId, setSelectedCustomerId] =
    useState("");


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
  // LEFT TABLE
  // ==========================================

  const [availableCasings, setAvailableCasings] =
    useState<CustomerCasing[]>([]);


  // ==========================================
  // RIGHT TABLE
  // ==========================================

  const [selectedCasings, setSelectedCasings] =
    useState<CustomerCasing[]>([]);


  // ==========================================
  // ORIGINAL EDIT CASING IDS
  //
  // Example:
  // Existing = [3,4]
  //
  // User removes 3
  // User adds 5
  //
  // PUT:
  // add = [5]
  // remove = [3]
  // ==========================================

  const [originalEditCasingIds, setOriginalEditCasingIds] =
    useState<number[]>([]);


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
          Array.isArray(response.data.data)
            ? response.data.data
            : [],
        );

      } else {

        setCustomers([]);

        console.error(
          "Customers API failed:",
          response.data?.error,
        );

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
          Array.isArray(response.data.data)
            ? response.data.data
            : [],
        );

      } else {

        setServiceTypes([]);

        console.error(
          "Service Types API failed:",
          response.data?.error,
        );

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

  const getApprovedCasingsFromQC = async () => {

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
        Array.isArray(response.data.data)
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


      setBatchCasings(
        casings,
      );

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
  // LOAD DATA
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


    console.log(
      "Available Casings:",
      filteredCasings,
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
  // LEFT -> RIGHT
  // ==========================================

  const handleAddCasing = (
    item: CustomerCasing,
  ) => {

    console.log(
      "ADDING CASING:",
      item,
    );


    setSelectedCasings(
      (prev) => {

        const exists =
          prev.some(
            (x) =>
              x.orderCasingId ===
              item.orderCasingId,
          );


        if (exists) {
          return prev;
        }


        return [
          ...prev,
          item,
        ];

      },
    );


    // Immediately remove from left table
    setAvailableCasings(
      (prev) =>
        prev.filter(
          (x) =>
            x.orderCasingId !==
            item.orderCasingId,
        ),
    );

  };


  // ==========================================
  // REMOVE CASING
  // RIGHT -> LEFT
  // ==========================================

  const handleRemoveCasing = (
    item: CustomerCasing,
  ) => {

    console.log(
      "REMOVING CASING:",
      item,
    );


    // Remove from right table
    setSelectedCasings(
      (prev) =>
        prev.filter(
          (x) =>
            x.orderCasingId !==
            item.orderCasingId,
        ),
    );


    // IMPORTANT:
    // Put it directly back into LEFT TABLE.
    //
    // Do not depend only on useEffect.
    //

    setAvailableCasings(
      (prev) => {

        const exists =
          prev.some(
            (x) =>
              x.orderCasingId ===
              item.orderCasingId,
          );


        if (exists) {
          return prev;
        }


        return [
          ...prev,
          item,
        ];

      },
    );

  };


  // ==========================================
  // LOAD EXISTING CASINGS FOR EDIT
  // ==========================================

  const loadEditCasings = (
    casings: any[],
  ) => {

    if (
      !Array.isArray(casings)
    ) {

      setSelectedCasings([]);

      setOriginalEditCasingIds([]);

      return;

    }


    // ==========================================
    // MAP API CASINGS
    // ==========================================

    const mappedCasings:
      CustomerCasing[] =
      casings.map(
        (casing: any) => ({

          orderCasingId:
            casing.orderCasingId,

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


    // ==========================================
    // SAVE ORIGINAL IDS
    // ==========================================

    const originalIds =
      mappedCasings.map(
        (item) =>
          item.orderCasingId,
      );


    console.log(
      "ORIGINAL EDIT CASING IDS:",
      originalIds,
    );


    setOriginalEditCasingIds(
      originalIds,
    );


    // ==========================================
    // IMPORTANT FIX
    //
    // Merge edit casings into batchCasings.
    //
    // This allows a removed casing to come
    // back to the left table.
    // ==========================================

    setBatchCasings(
      (prev) => {

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

      },
    );


    // ==========================================
    // SHOW EXISTING CASINGS ON RIGHT
    // ==========================================

    setSelectedCasings(
      mappedCasings,
    );

  };


  // ==========================================
  // GET ADD / REMOVE IDS FOR UPDATE
  // ==========================================

  const getUpdateCasingIds = () => {

    const currentIds =
      selectedCasings.map(
        (item) =>
          item.orderCasingId,
      );


    // ==========================================
    // ADD
    //
    // Current but not originally present
    // ==========================================

    const addOrderCasingIds =
      currentIds.filter(
        (id) =>
          !originalEditCasingIds.includes(
            id,
          ),
      );


    // ==========================================
    // REMOVE
    //
    // Originally present but no longer current
    // ==========================================

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
  // GENERATE DELIVERY ORDER NUMBER
  // ==========================================

  const generateDONumber = () => {

    const random =
      Math.floor(
        100 +
        Math.random() * 900,
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

  };


  // ==========================================
  // RETURN
  // ==========================================

  return {

    deliveryDate,
    setDeliveryDate,

    serviceType,
    setServiceType,

    serviceTypes,
    loadingServiceTypes,

    selectedCustomerId,
    setSelectedCustomerId,

    customers,
    selectedCustomer,
    loadingCustomers,

    batchCasings,
    loadingBatchCasings,

    availableCasings,

    selectedCasings,

    handleAddCasing,

    handleRemoveCasing,

    loadEditCasings,

    getUpdateCasingIds,

    generateDONumber,

    reset,

    dispatchTeam,

  };

};


export default useCustomerDeliveryOrderModal;