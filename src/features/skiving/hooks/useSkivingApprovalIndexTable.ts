import { useEffect, useMemo, useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import type{
    skivingApprovalRow,
    RepairOperation,
} from "../types/skivingApprovalTypes";

const SKIVING_APPROVAL_STAGE = 8;
const SKIVING_APPROVAL_SUBSTAGE = 82;
const ACTIVE_STATUS = 1;

interface ApiOperation {
    repairType: string;
    repairLocation: string;
}

interface ApiCasing {
    orderCasingId: number;

    productionNumber?: string;
    barcodeNumber?: string;

    tyreReferenceNumber?: string;

    dotNumber?: string;

    tyreSizeLabel?: string;

    patternName?: string;

    orderDate?: string;

    customerName?: string;

    damageLevelId?: number;

    currentStage: number;
    currentSubstage: number;
    currentStageStatus: number;

    repairDetail?: {
        operations?: ApiOperation[];
    };
}

interface ApiBatch {
    batchNumber?: string;
    casings?: ApiCasing[];
}

interface ApiStage {
    batches?: ApiBatch[];
}

export const useSkivingApprovalIndexTable = (
    search: string
) => {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [
        skivingApprovalData,
        setSkivingApprovalData,
    ] = useState<skivingApprovalRow[]>([]);

    const transformSkivingApprovalData = (
        stages: ApiStage[]
    ): skivingApprovalRow[] => {
        const transformed: skivingApprovalRow[] = [];

        (stages || []).forEach((stage) => {
            stage.batches?.forEach((batch) => {
                batch.casings?.forEach((casing) => {
                    const repairOperations: RepairOperation[] =
                        casing.repairDetail?.operations?.map(
                            (op) => ({
                                repairType:
                                    op.repairType,
                                repairLocation:
                                    op.repairLocation,
                            })
                        ) || [];

                    transformed.push({
                        id:
                            casing.orderCasingId,

                        casing:
                            casing.productionNumber ||
                            casing.barcodeNumber ||
                            "-",

                        serial:
                            casing.tyreReferenceNumber ||
                            "-",

                        pattern:
                            casing.patternName ||
                            "-",

                        requestedPattern:
                            casing.patternName ||
                            "-",

                        date:
                            casing.orderDate ||
                            "-",

                        customerName:
                            casing.customerName ||
                            "-",

                        service:
                            batch.batchNumber?.startsWith(
                                "RT"
                            )
                                ? "Retread"
                                : "Repair",

                        batchNo:
                            batch.batchNumber ||
                            "-",

                        damageLevel:
                            casing.damageLevelId === 1
                                ? "Normal"
                                : casing.damageLevelId === 2
                                    ? "Heavy"
                                    : "-",

                        repairOperations,

                        tyreSize:
                            casing.tyreSizeLabel ||
                            "-",

                        tyreMake: "-",

                        model: "-",

                        brand: "-",

                        width: "-",

                        tyresCollected: 1,

                        tyresAvailable: 1,

                        collectorZone: "-",

                        currentStage:
                            casing.currentStage,

                        currentSubstage:
                            casing.currentSubstage,

                        currentStageStatus:
                            casing.currentStageStatus,
                    });
                });
            });
        });

        return transformed;
    };

    const loadSkivingApproval =
        async (): Promise<void> => {
            try {
                setLoading(true);

                const res =
                    await indexPageApiService.getBatchProgress(
                        SKIVING_APPROVAL_STAGE,
                        SKIVING_APPROVAL_SUBSTAGE,
                        ACTIVE_STATUS
                    );

                const transformed =
                    transformSkivingApprovalData(
                        res.data?.data || []
                    );

                setSkivingApprovalData(
                    transformed
                );
            } catch (error) {
                console.error(
                    "Skiving Approval Error",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadSkivingApproval();
    }, []);

    const filteredApproval =
        useMemo(() => {
            return skivingApprovalData.filter(
                (item) =>
                    `${item.casing}
           ${item.serial}
           ${item.pattern}`
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
        }, [
            search,
            skivingApprovalData,
        ]);

    return {
        loading,

        skivingApprovalData,

        filteredApproval,

        loadSkivingApproval,
    };
};