import { useState, useCallback } from "react";
import byPassTyreServiceApi from "../services/byPassTyreServiceApi";

export const useByPassTyres = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transformData = (apiData: any[]) => {
        if (!apiData || apiData.length === 0) return [];

        const stage = apiData[0];
        const batches = stage.batches || [];

        return batches.map((batch: any) => ({
            productionNo: batch.batchNumber,
            children: batch.casings.map((casing: any) => ({
                orderCasingId: casing.orderCasingId,
                productionNo: casing.productionNumber,
                date: casing.orderDate,
                tyreRefNo: casing.tyreReferenceNumber,
                pattern: casing.patternName,
                make: casing.tyreMakeName,
                tyreSize: casing.tyreSizeLabel,
                service: casing.serviceTypeName,
                turnaround: 0,
                zoneAlarm: "RED",
            })),
        }));
    };
    // Function to skip stages for selected casings
    const skipStages = async (orderCasingIds: number[], skippedStages: number[]) => {
        try {
            setLoading(true);
            setError(null);

            await byPassTyreServiceApi.skipStages({
                orderCasingIds,
                skippedStages,
            });

            await loadBatchProgress(); // refresh

        } catch (err: any) {
            setError(err?.response?.data?.error?.message || "Skip failed");
            throw err; // 🔥 important for UI
        } finally {
            setLoading(false);
        }
    };
    //load index page data for bypass tyres
    const loadBatchProgress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await byPassTyreServiceApi.getBatchProgress(3, 1);

            const formatted = transformData(res?.data?.data || []);

            setData(formatted);
        } catch (err: any) {
            setError(err?.message || "Error loading data");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        loadBatchProgress,
        skipStages,
    };
};