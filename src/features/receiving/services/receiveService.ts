import api from "../../../shared/services/api";


const receiveService = {
  getCollectionOrders: (params = {}) =>
    api.get("/orders", {
      params: {
        ...params,
        currentStage: 1,
        currentStageStatus: 2,
      },
    }),

  getBatchOrders: (params = {}) =>
    api.get("/orders", {
      params: {
        ...params,
        casingStage: 2,
        currentSubstage: 21,
        status: 2,
      },
    }),

  getBarcodeOrders: (params = {}) =>
    api.get("/orders", {
      params: {
        ...params,
        casingStage: 2,
        currentSubstage: 22,
        status: 2,
      },
    }),

  confirmReceive: (data: any) =>
    api.post("/receiving/casings", data),

  createBatch: (data: any) =>
    api.post("/batches/casings", data),

   createVisualInspection: (data:any) =>
    api.post(`/visual-inspection/casings`, data),
};

export default receiveService;