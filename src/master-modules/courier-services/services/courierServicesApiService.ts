import { apiRequest } from "../../../shared/services/apiClient";

import type {
    ApiResponse, CourierService, CreateCourierServiceRequest,
    UpdateCourierServiceRequest
} from "../types/courierServices.type";

/*
 * ==========================================================
 * GET COURIER SERVICES
 *
 * GET /courier-services?courierType=2
 *
 * courierType:
 * 1 = External Courier
 * 2 = Internal Courier
 * ==========================================================
 */

const getCourierServices = async (
    courierType: number
): Promise<CourierService[]> => {
    const response =
        await apiRequest<ApiResponse<CourierService[]>>(
            `/courier-services?courierType=${courierType}`
        );
    if (!response.success) {
        throw new Error(
            response.error ||
            "Failed to fetch courier services."
        );
    }
    return response.data || [];
};

/*
 * ==========================================================
 * GET COURIER SERVICE BY ID
 *
 * GET /courier-services/:courierServiceId
 * ==========================================================
 */

const getCourierServiceById = async (
    courierServiceId: number
): Promise<CourierService> => {
    const response =
        await apiRequest<ApiResponse<CourierService>>(
            `/courier-services/${courierServiceId}`
        );
    if (!response.success) {
        throw new Error(
            response.error ||
            "Failed to fetch courier service details."
        );
    }
    return response.data;
};

/*
 * ==========================================================
 * CREATE COURIER SERVICE
 *
 * POST /courier-services
 * ==========================================================
 */

const createCourierService = async (
    request: CreateCourierServiceRequest
): Promise<CourierService> => {
    const response =
        await apiRequest<ApiResponse<CourierService>>(
            "/courier-services",
            {
                method: "POST",
                body: JSON.stringify(request),
            }
        );
    if (!response.success) {
        throw new Error(
            response.error ||
            "Failed to create courier service."
        );
    }
    return response.data;
};

/*
 * ==========================================================
 * UPDATE COURIER SERVICE
 *
 * PUT /courier-services/:courierServiceId
 * ==========================================================
 */

const updateCourierService = async (
    courierServiceId: number,
    request: UpdateCourierServiceRequest
): Promise<CourierService> => {
    const response =
        await apiRequest<ApiResponse<CourierService>>(
            `/courier-services/${courierServiceId}`,
            {
                method: "PUT",
                body: JSON.stringify(request),
            }
        );
    if (!response.success) {
        throw new Error(
            response.error ||
            "Failed to update courier service."
        );
    }
    return response.data;
};

/*
 * ==========================================================
 * DELETE COURIER SERVICE
 *
 * DELETE /courier-services/:courierServiceId
 * ==========================================================
 */

const deleteCourierService = async (
    courierServiceId: number
): Promise<void> => {
    const response =
        await apiRequest<ApiResponse<unknown>>(
            `/courier-services/${courierServiceId}`,
            {
                method: "DELETE",
            }
        );
    if (!response.success) {
        throw new Error(
            response.error ||
            "Failed to delete courier service."
        );
    }
};

const courierServicesApiService = {
    getCourierServices,
    getCourierServiceById,
    createCourierService,
    updateCourierService,
    deleteCourierService,
};

export default courierServicesApiService;