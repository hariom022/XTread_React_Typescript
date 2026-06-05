import api from "./api";

const indexPageApiService = {
  getBatchProgress: (currentStage: number, currentStageStatus: number) =>
    api.get("/batches/progress", {
      params: {
        currentStage,
        currentStageStatus,
      },
    }),

  getOrderCasingDetails: (orderCasingId: number) =>
    api.get(`/orders/casings/${orderCasingId}`),
};

export default indexPageApiService;
