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
    // QC BATCH CASINGS
    // ==========================================

    const [batchCasings, setBatchCasings] =
        useState<CustomerCasing[]>([]);


    const [loadingBatchCasings, setLoadingBatchCasings] =
        useState(false);


    // ==========================================
    // CUSTOMER CASING ORDERS
    // ==========================================

    const [availableCasings, setAvailableCasings] =
        useState<CustomerCasing[]>([]);


    // ==========================================
    // SELECTED CASINGS
    // ==========================================

    const [selectedCasings, setSelectedCasings] =
        useState<CustomerCasing[]>([]);


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

            const response =
                await dispatchServiceApi.getApprovedFromQC();

            console.log(
                "Approved From QC API Response:",
                response.data
            );

            if (!response.data?.success) {

                console.error(
                    "Approved From QC API failed:",
                    response.data?.error
                );

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

                        if (!Array.isArray(stage.batches)) {
                            return [];
                        }

                        return stage.batches.flatMap(
                            (batch: any) => {

                                if (
                                    !Array.isArray(
                                        batch.casings
                                    )
                                ) {
                                    return [];
                                }

                                return batch.casings.map(
                                    (casing: any) => ({

                                        orderCasingId:
                                            casing.orderCasingId,

                                        customerName:
                                            casing.customerName,

                                        batchNo:
                                            batch.batchNumber,

                                        productionNo:
                                            casing.productionNumber,

                                        tyreSize:
                                            casing.tyreSizeLabel,

                                        tyreMake:
                                            casing.tyreMakeName,

                                        service:
                                            casing.serviceTypeName,

                                    })
                                );
                            }
                        );
                    }
                );


            console.log(
                "Flattened QC Casings:",
                casings
            );

            setBatchCasings(casings);

        } catch (error) {

            console.error(
                "Error fetching approved casings from QC:",
                error
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
    // LOAD ALL MASTER + QC DATA
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
    // FILTER CUSTOMER CASING ORDERS
    // ==========================================

    useEffect(() => {

        // ==========================================
        // CUSTOMER OR SERVICE TYPE NOT SELECTED
        // ==========================================

        if (
            !selectedCustomer ||
            !selectedServiceType
        ) {

            setAvailableCasings([]);

            return;
        }


        // ==========================================
        // SELECTED CUSTOMER NAME
        // ==========================================

        const customerName =
            selectedCustomer.customerName
                .trim()
                .toLowerCase();


        // ==========================================
        // SELECTED SERVICE TYPE NAME
        // ==========================================

        const serviceTypeName =
            selectedServiceType.serviceTypeName
                .trim()
                .toLowerCase();


        // ==========================================
        // FILTER
        // ==========================================

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


                    return (
                        casingCustomerName ===
                        customerName

                        &&

                        casingServiceType ===
                        serviceTypeName
                    );
                },
            );


        console.log(
            "Selected Customer:",
            customerName,
        );


        console.log(
            "Selected Service Type:",
            serviceTypeName,
        );


        console.log(
            "QC Batch Casings:",
            batchCasings,
        );


        console.log(
            "Filtered Customer Casings:",
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
    ]);


    // ==========================================
    // ADD CASING
    // ==========================================

    const handleAddCasing = (
        item: CustomerCasing,
    ) => {

        console.log(
            "ADDING CASING:",
            item,
        );


        // Add to selected list
        setSelectedCasings(
            (prev) => {

                // Prevent duplicate
                const alreadyExists =
                    prev.some(
                        (x) =>
                            x.orderCasingId ===
                            item.orderCasingId,
                    );


                if (alreadyExists) {
                    return prev;
                }


                return [
                    ...prev,
                    item,
                ];
            },
        );


        // Remove from available list
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
    // ==========================================

    const handleRemoveCasing = (
        item: CustomerCasing,
    ) => {

        console.log(
            "REMOVING CASING:",
            item,
        );


        // Remove from selected
        setSelectedCasings(
            (prev) =>
                prev.filter(
                    (x) =>
                        x.orderCasingId !==
                        item.orderCasingId,
                ),
        );


        // Add back to available
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
    };


    // ==========================================
    // RETURN
    // ==========================================

    return {

        // Date
        deliveryDate,
        setDeliveryDate,

        // Service Type
        serviceType,
        setServiceType,
        serviceTypes,
        loadingServiceTypes,

        // Customer
        selectedCustomerId,
        setSelectedCustomerId,
        customers,
        selectedCustomer,
        loadingCustomers,

        // QC Batch
        batchCasings,
        loadingBatchCasings,

        // Available
        availableCasings,

        // Selected
        selectedCasings,

        // Actions
        handleAddCasing,
        handleRemoveCasing,

        // Other
        generateDONumber,
        reset,
        dispatchTeam,
    };
};


export default useCustomerDeliveryOrderModal;