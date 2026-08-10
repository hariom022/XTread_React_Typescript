import api from "../../../shared/services/api";

const rejectedTyreServiceApi = {
    getRejectedTyres: async (params: {
        from?: string;
        to?: string;
        rejectedAtStage?: number;
        categoryId?: number;
        serviceTypeId?: number;
        tyreMakeId?: number;
        isRetreaded?: boolean;
        batchNumber?: string;
        orderId?: number;
        search?: string;
    }) => {
        try {
            return await api.get("/rejected-casings", {
                params: params, 
            });
        } catch (error) {
            throw error;
        }
    },

    // ✅ Reverse rejected tyres
    reverseRejectedTyres: async (orderCasingIds: number[]) => {
        try {
            return await api.post("/rejected-casings/reverse", {
                orderCasingIds: orderCasingIds, 
            });
        } catch (error) {
            throw error;
        }
    },
};

export default rejectedTyreServiceApi;