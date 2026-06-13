import { useEffect, useState } from "react";
import fillUpServiceApi from "../service/fillUpServiceApi";

const useFillUpStockMgt = () => {
    const [fillUpType, setFillUpType] =
        useState("");

    const [openingStock, setOpeningStock] =
        useState("");

    const [closingStock, setClosingStock] =
        useState("");

    const [wasteFillUpType, setWasteFillUpType] =
        useState("");

    const [wasteKg, setWasteKg] =
        useState("");

    const [consumptionList, setConsumptionList] =
        useState<any[]>([]);

    const [wastageList, setWastageList] =
        useState<any[]>([]);

    const [fillUpTypes, setFillUpTypes] =
        useState<
            {
                fillUpTypeId: number;
                displayName: string;
            }[]
        >([]);

    useEffect(() => {
        loadFillUpTypes();
    }, []);

    const loadFillUpTypes = async () => {
        try {
            const response =
                await fillUpServiceApi.getFillUpTypes();

            setFillUpTypes(
                response.data.data || [],
            );
        } catch (error) {
            console.error(
                "FillUp Types Error",
                error,
            );
        }
    };

    const addConsumption = () => {
        if (
            !fillUpType ||
            !openingStock ||
            !closingStock
        ) {
            alert("Please fill all fields");
            return;
        }

        setConsumptionList((prev) => [
            ...prev,
            {
                fillUpType,
                openingStock,
                closingStock,
            },
        ]);

        setFillUpType("");
        setOpeningStock("");
        setClosingStock("");
    };

    const addWastage = () => {
        if (
            !wasteFillUpType ||
            !wasteKg
        ) {
            alert("Please fill all fields");
            return;
        }

        setWastageList((prev) => [
            ...prev,
            {
                wasteFillUpType,
                wasteKg,
            },
        ]);

        setWasteFillUpType("");
        setWasteKg("");
    };
    const resetStockMgt = () => {
        setFillUpType("");
        setOpeningStock("");
        setClosingStock("");

        setWasteFillUpType("");
        setWasteKg("");

        setConsumptionList([]);
        setWastageList([]);
    };

    return {
        fillUpType,
        setFillUpType,

        openingStock,
        setOpeningStock,

        closingStock,
        setClosingStock,

        wasteFillUpType,
        setWasteFillUpType,

        wasteKg,
        setWasteKg,

        consumptionList,

        wastageList,

        fillUpTypes,

        addConsumption,

        addWastage,
        resetStockMgt,
    };
};

export default useFillUpStockMgt;