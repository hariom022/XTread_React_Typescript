import { useEffect, useState } from "react";

import fillUpServiceApi from "../service/fillUpServiceApi";

interface Props {
    selectedItem: any;

    refreshTable: () => void;

    onClose: () => void;
}

const useFillUpModal = ({
    selectedItem,
    refreshTable,
    onClose,
}: Props) => {
    const [fillUpType, setFillUpType] =
        useState("");
        const [processing, setProcessing] = useState(false);

    const [fillUpTypes, setFillUpTypes] =
        useState<
            {
                fillUpTypeId: number;
                displayName: string;
            }[]
        >([]);

    // ==========================
    // LOAD FILLUP TYPES
    // ==========================

    const loadFillUpTypes =
        async () => {
            try {
                const res =
                    await fillUpServiceApi.getFillUpTypes();

                setFillUpTypes(
                    res.data.data || []
                );
            } catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {
        loadFillUpTypes();
    }, []);

    // ==========================
    // RESET
    // ==========================

    const resetModal = () => {
        setFillUpType("");
    };

    // ==========================
    // SAVE
    // ==========================

    const handleSave = async () => {
        console.log("SAVE CLICKED");
        try {
            setProcessing(true);
            if (!fillUpType) {
                alert(
                    "Please select Fill Up Type"
                );

                return;
            }

            const payload = {
                orderCasingIds: [
                    selectedItem.orderCasingId,
                ],

                isApproved: true,

                fillUpTypeId:
                    fillUpType,

                rejectionReasonCode:
                    "",
            };

            console.log(
                "FILLUP SAVE PAYLOAD",
                payload
            );
            console.log("FILLUP TYPE", fillUpType);
            console.log("SELECTED ITEM", selectedItem);

            await fillUpServiceApi.approveFillUp(
                payload
            );

            alert(
                "Fill Up saved successfully"
            );

            resetModal();

            onClose();

            refreshTable();
        } catch (error) {
            console.error(error);

            alert(
                "Failed to save Fill Up"
            );
        }finally{
            setProcessing(false);
        }
    };

    return {
        fillUpType,
        setFillUpType,

        fillUpTypes,
        processing,
        handleSave,

        resetModal,
    };
};

export default useFillUpModal;