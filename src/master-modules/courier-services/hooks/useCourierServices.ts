import {
    useCallback,
    useEffect,
    useState,
} from "react";

import courierServicesApiService from "../services/courierServicesApiService";

import type {
    CourierService,
    CreateCourierServiceRequest,
    UpdateCourierServiceRequest,
} from "../types/courierServices.type";

const useCourierServices = (
    courierType: number | null = null
) => {
    const [
        courierServices,
        setCourierServices,
    ] = useState<CourierService[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    const [submitting, setSubmitting] =
        useState<boolean>(false);

    /*
     * ==========================================================
     * FETCH COURIER SERVICES
     *
     * null = All
     * 1    = External
     * 2    = Internal
     * ==========================================================
     */

    const fetchCourierServices =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                /*
                 * ==================================================
                 * ALL COURIER SERVICES
                 *
                 * API currently supports filtering by courierType,
                 * therefore when "All" is selected we call both
                 * APIs and combine their results.
                 * ==================================================
                 */

                if (courierType === null) {
                    const [
                        externalServices,
                        internalServices,
                    ] = await Promise.all([
                        courierServicesApiService.getCourierServices(1),
                        courierServicesApiService.getCourierServices(2),
                    ]);

                    setCourierServices([
                        ...externalServices,
                        ...internalServices,
                    ]);

                    return;
                }

                /*
                 * ==================================================
                 * SPECIFIC COURIER TYPE
                 * ==================================================
                 */

                const data =
                    await courierServicesApiService.getCourierServices(
                        courierType
                    );

                setCourierServices(data);
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch courier services.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [courierType]);

    /*
     * ==========================================================
     * INITIAL LOAD / FILTER CHANGE
     * ==========================================================
     */

    useEffect(() => {
        fetchCourierServices();
    }, [fetchCourierServices]);

    /*
     * ==========================================================
     * GET BY ID
     * ==========================================================
     */

    const getCourierServiceById =
        async (
            courierServiceId: number
        ): Promise<CourierService> => {
            return courierServicesApiService.getCourierServiceById(
                courierServiceId
            );
        };

    /*
     * ==========================================================
     * CREATE
     * ==========================================================
     */

    const createCourierService =
        async (
            request: CreateCourierServiceRequest
        ): Promise<CourierService> => {
            try {
                setSubmitting(true);
                setError("");

                const created =
                    await courierServicesApiService.createCourierService(
                        request
                    );

                await fetchCourierServices();

                return created;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to create courier service.";

                setError(message);

                throw err;
            } finally {
                setSubmitting(false);
            }
        };

    /*
     * ==========================================================
     * UPDATE
     * ==========================================================
     */

    const updateCourierService =
        async (
            courierServiceId: number,
            request: UpdateCourierServiceRequest
        ): Promise<CourierService> => {
            try {
                setSubmitting(true);
                setError("");

                const updated =
                    await courierServicesApiService.updateCourierService(
                        courierServiceId,
                        request
                    );

                await fetchCourierServices();

                return updated;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to update courier service.";

                setError(message);

                throw err;
            } finally {
                setSubmitting(false);
            }
        };

    /*
     * ==========================================================
     * DELETE
     * ==========================================================
     */

    const deleteCourierService =
        async (
            courierServiceId: number
        ): Promise<void> => {
            try {
                setSubmitting(true);
                setError("");

                await courierServicesApiService.deleteCourierService(
                    courierServiceId
                );

                await fetchCourierServices();
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to delete courier service.";

                setError(message);

                throw err;
            } finally {
                setSubmitting(false);
            }
        };

    /*
     * ==========================================================
     * RELOAD
     * ==========================================================
     */

    const reload = async () => {
        await fetchCourierServices();
    };

    return {
        courierServices,
        loading,
        error,
        submitting,

        getCourierServiceById,
        createCourierService,
        updateCourierService,
        deleteCourierService,

        reload,
    };
};

export default useCourierServices;