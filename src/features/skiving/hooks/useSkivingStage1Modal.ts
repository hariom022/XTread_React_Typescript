import { useEffect, useState } from "react";

import skivingStageServiceApi from "../service/skivingStageServiceApi";

import type {
    Machine,
    SkivingRepair,
    InspectionRepair,
    skivingStage1Row,
    SaveSkivingStage1Payload,
} from "../types/skivingStage1Types";

export const useSkivingStage1Modal = (
    reloadGrid: () => void
) => {
    const [selectedItem, setSelectedItem] =
        useState<skivingStage1Row | null>(
            null
        );

    const [machines, setMachines] =
        useState<Machine[]>([]);

    const [inspectionData, setInspectionData] =
        useState<InspectionRepair[]>([]);

    const [skivingStation, setSkivingStation] =
        useState<string>("");

    const [remarks, setRemarks] =
        useState<string>("");

    const [skivingRepairs, setSkivingRepairs] =
        useState<SkivingRepair[]>([]);

    const [newRepair, setNewRepair] =
        useState<SkivingRepair>({
            location: "",
            type: "",
        });

    const openModal = (
        item: skivingStage1Row
    ) => {
        console.log(
            "openModal called",
            item
        );

        setSelectedItem(item);

        setInspectionData(
            item.inspectionRepairs || []
        );
    };
    const closeModal = () => {
        setSelectedItem(null);

        setInspectionData([]);

        setSkivingStation("");

        setRemarks("");

        setSkivingRepairs([]);

        setNewRepair({
            location: "",
            type: "",
        });
    };

    const resetForm = () => {
        setSelectedItem(null);

        setInspectionData([]);

        setSkivingStation("");

        setRemarks("");

        setSkivingRepairs([]);

        setNewRepair({
            location: "",
            type: "",
        });
    };

    const loadMachines =
        async (): Promise<void> => {
            try {
                const response =
                    await skivingStageServiceApi.getMachines();

                setMachines(
                    response.data?.data || []
                );
            } catch (error) {
                console.error(
                    "Machine API Error",
                    error
                );
            }
        };

    useEffect(() => {
        loadMachines();
    }, []);

    const addRepair = () => {
        if (
            !newRepair.location ||
            !newRepair.type
        ) {
            alert(
                "Please select all repair fields"
            );

            return;
        }

        setSkivingRepairs(
            (prev) => [
                ...prev,
                newRepair,
            ]
        );

        setNewRepair({
            location: "",
            type: "",
        });
    };

    const deleteRepair = (
        index: number
    ) => {
        setSkivingRepairs(
            (prev) =>
                prev.filter(
                    (_, i) => i !== index
                )
        );
    };

    const handleSave =
        async (): Promise<boolean> => {
            if (!selectedItem)
                return false;

            if (!skivingStation) {
                alert(
                    "Please select Skiving Station"
                );

                return false;
            }

            try {
                const payload: SaveSkivingStage1Payload =
                {
                    orderCasingIds: [
                        selectedItem.id,
                    ],

                    isApproved: true,

                    machineId:
                        String(
                            skivingStation
                        ),

                    rejectionReasonCode:
                        null,

                    repairOperations:
                        skivingRepairs.map(
                            (repair) => ({
                                repairType:
                                    repair.type,

                                repairLocation:
                                    repair.location,

                                quantity: 1,
                            })
                        ),
                };

                await skivingStageServiceApi.saveSkivingStage1(
                    payload
                );

                alert(
                    "Skiving Stage 1 saved successfully"
                );

                reloadGrid();

                resetForm();

                return true;
            } catch (error) {
                console.error(error);

                alert(
                    "Failed to save Skiving Stage 1"
                );

                return false;
            }
        };

    return {
        selectedItem,

        machines,

        inspectionData,

        skivingStation,
        setSkivingStation,

        remarks,
        setRemarks,

        skivingRepairs,

        newRepair,
        setNewRepair,

        openModal,

        resetForm,

        addRepair,

        deleteRepair,

        handleSave,
        closeModal,
    };
};