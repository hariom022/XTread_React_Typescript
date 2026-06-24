import { useEffect, useMemo, useState } from "react";

import type { Customer, CustomerCasing, DispatchTeam, SalesRep, } from "../type/dispatch.types";

const useCustomerDeliveryOrderModal = (dispatchTeam: DispatchTeam,) => {
    const [deliveryDate, setDeliveryDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0],
        );

    const [serviceType, setServiceType] = useState("");

    const [selectedCustomerId, setSelectedCustomerId,] = useState("");

    const [availableCasings, setAvailableCasings,] = useState<CustomerCasing[]>([]);

    const [selectedCasings, setSelectedCasings,] = useState<CustomerCasing[]>([]);

    const customers: Customer[] = [
        {
            id: 1,
            name: "RONGAI WORKSHOP",
            salesRep: "Jhon",
            casings: [
                {
                    casing: "XT1001",
                    serial: "S001",
                    size: "315/80 R22.5",
                    service: "Retread",
                },
            ],
        },
        {
            id: 2,
            name: "NAIROBI TRANSPORT",
            salesRep: "Victor",
            casings: [
                {
                    casing: "XT2001",
                    serial: "S101",
                    size: "295/90 R20",
                    service: "Repair",
                },
            ],
        },
    ];

    const salesReps: SalesRep[] = [
        {
            id: 1,
            name: "Jhon",
            zone: "North Zone",
        },
        {
            id: 2,
            name: "Victor",
            zone: "South Zone",
        },
    ];
    const selectedCustomer =
        customers.find(
            (x) =>
                x.id ===
                Number(selectedCustomerId),
        );

    useEffect(() => {
        if (
            !selectedCustomer ||
            !serviceType
        ) {
            setAvailableCasings([]);
            return;
        }

        const filtered =
            selectedCustomer.casings.filter(
                (x) =>
                    x.service.toLowerCase() ===
                    serviceType.toLowerCase(),
            );

        setAvailableCasings(filtered);
    }, [
        selectedCustomerId,
        serviceType,
    ]);


    const handleAddCasing = (
        item: CustomerCasing,
    ) => {
        console.log(
            "ADDING CASING",
            item,
        );

        setSelectedCasings((prev) => {
            const updated = [
                ...prev,
                item,
            ];

            console.log(
                "SELECTED CASINGS",
                updated,
            );

            return updated;
        });

        setAvailableCasings((prev) =>
            prev.filter(
                (x) =>
                    x.casing !== item.casing,
            ),
        );
    };

    const generateDONumber =
        () => {
            const random =
                Math.floor(
                    100 +
                    Math.random() *
                    900,
                );

            return `DEV-${new Date()
                .toISOString()
                .slice(0, 10)
                .replace(
                    /-/g,
                    "",
                )}-${random}`;
        };

    const reset = () => {
        setDeliveryDate(
            new Date().toISOString().split("T")[0],
        );

        setSelectedCustomerId("");

        setServiceType("");

        setAvailableCasings([]);

        setSelectedCasings([]);
    };

    return {
        deliveryDate,
        setDeliveryDate,

        serviceType,
        setServiceType,

        selectedCustomerId,
        setSelectedCustomerId,

        customers,

        selectedCustomer,

        salesReps,

        availableCasings,

        selectedCasings,

        handleAddCasing,

        generateDONumber,

        reset,

        dispatchTeam,
    };
};

export default useCustomerDeliveryOrderModal;