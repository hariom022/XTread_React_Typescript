import api from "../../../shared/services/api";

export interface RejectedTyresParams {
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
}

const rejectedTyreServiceApi = {
  getRejectedTyres: async (params: RejectedTyresParams = {}) => {
    return await api.get("/rejected-casings", {
      params,
    });
  },

  reverseRejectedTyres: async (orderCasingIds: number[]) => {
    return await api.post("/rejected-casings/reverse", {
      orderCasingIds,
    });
  },
};

export default rejectedTyreServiceApi;