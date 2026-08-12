import { useState, useMemo, useCallback } from "react";
import byPassTyreServiceApi from "../services/byPassTyreServiceApi";

export const useByPassTyres = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
     // ================= SEARCH =================
    const [search, setSearch] = useState("");

    // ================= TRANSFORM DATA =================

    const transformData = (apiData: any[]) => {
        if (!apiData || apiData.length === 0) return [];

        const stage = apiData[0];
        const batches = stage.batches || [];

        return batches.map((batch: any) => ({
            batchNumber: batch.batchNumber,
            casings: batch.casings.map((casing: any) => ({
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

     // ================= SEARCH FILTER =================

    const filteredData = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        // If search is empty, return everything
        if (!searchTerm) {
            return data;
        }

        return data
            .map((parent: any) => {

                // Check batch / production number
                const batchMatches =
                    parent.batchNumber
                        ?.toLowerCase()
                        .includes(searchTerm);

                // Check casing data
                const matchingCasings =
                    parent.casings.filter((c: any) =>
                        `${c.productionNo || ""}
                         ${c.tyreRefNo || ""}
                         ${c.pattern || ""}
                         ${c.make || ""}
                         ${c.tyreSize || ""}
                         ${c.service || ""}`
                            .toLowerCase()
                            .includes(searchTerm)
                    );

                // Keep parent if:
                // 1. Batch number matches
                // OR
                // 2. At least one child matches
                if (batchMatches || matchingCasings.length > 0) {
                    return {
                        ...parent,
                        casings: batchMatches
                            ? parent.casings
                            : matchingCasings,
                    };
                }

                return null;
            })
            .filter(Boolean);
    }, [data, search]);

    return {
        data,
        filteredData,
        loading,
        error,
        loadBatchProgress,
        skipStages,
        // Search
        search,
        setSearch,
    };
};