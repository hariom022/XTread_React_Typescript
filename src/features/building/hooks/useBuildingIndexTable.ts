import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";
import useBuildingModal from "./useBuildingModal";
import BuildingModal from "../components/BuildingModal";

import type { BuildingRow } from "../type/building.types";

const BUILDING_STAGE = 12;

const ACTIVE_STATUS = 1;

const useBuildingIndexTable = () => {
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [buildingData, setBuildingData] =
        useState<BuildingRow[]>([]);

    const loadBuildingOrders = async () => {
        try {
            setLoading(true);

            const result =
                await indexPageApiService.getBatchProgress(
                    BUILDING_STAGE,
                    ACTIVE_STATUS,
                );

            console.log(
                "BUILDING ORDER RESPONSE",
                result.data,
            );

            const stages =
                result.data.data || [];

            const transformed: BuildingRow[] = [];

            stages.forEach((stage: any) => {
                stage.batches?.forEach(
                    (batch: any) => {
                        batch.casings?.forEach(
                            (casing: any) => {
                                transformed.push({
                                    id:
                                        casing.orderCasingId,

                                    orderCasingId:
                                        casing.orderCasingId,

                                    casing:
                                        casing.productionNumber ||
                                        "-",

                                    serial:
                                        casing.tyreReferenceNumber ||
                                        "-",

                                    date:
                                        casing.orderDate ||
                                        "",

                                    customerName:
                                        casing.customerName ||
                                        "-",

                                    patternName:
                                        casing.patternName ||
                                        "-",

                                    tyreSize:
                                        casing.tyreSizeLabel ||
                                        "-",

                                    service:
                                        batch.batchNumber?.startsWith(
                                            "RT",
                                        )
                                            ? "Retread"
                                            : "Repair",

                                    batchNo:
                                        batch.batchNumber ||
                                        "-",

                                    approved:
                                        batch.stageSummary
                                            ?.approved || 0,

                                    rejected:
                                        batch.stageSummary
                                            ?.rejected || 0,

                                    pending:
                                        batch.stageSummary
                                            ?.pending || 0,

                                    expectedTotal:
                                        batch.stageSummary
                                            ?.expectedTotal || 0,

                                    originalBatch:
                                        batch,

                                    originalCasing:
                                        casing,
                                });
                            },
                        );
                    },
                );
            });

            setBuildingData(
                transformed,
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        loadBuildingOrders();
    }, []);

    const filteredData =
        useMemo(() => {
            return buildingData.filter(
                (item) =>
                    `${item.casing}
                 ${item.serial}
                 ${item.patternName}
                 ${item.customerName}
                 ${item.batchNo}`
                        .toLowerCase()
                        .includes(
                            search.toLowerCase(),
                        ),
            );
        }, [search, buildingData]);

    return {
        loading,

        search,
        setSearch,

        buildingData,
        filteredData,

        loadBuildingOrders,
    };
};

export default useBuildingIndexTable;