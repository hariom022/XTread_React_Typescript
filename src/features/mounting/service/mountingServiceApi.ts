import api from "../../../shared/services/api";

const mountingServiceApi = {
  /* ==========================
      INDEX PAGE DATA
  ========================== */

  getmountingOrders: () =>
    api.get(
      "/batches/progress?currentStage=13&currentStageStatus=1"
    ),
    getMountingOrdersLoaded: () =>
    api.get(
      "/batches/progress?currentStage=13&currentStageStatus=5"
    ),
  
  getAgriTyreSizePipes : (tyreSizeId: number) =>
  api.get(`/agriTyreSize/${tyreSizeId}/mounting`),

   
  /* ==========================
      API PENDING
  ========================== */

assignMounting(payload: {
  casings: {
    orderCasingId: string;
    railId: string;
    railPipeId: string;
  }[];
}) {
  return api.post("/enveloping/assign", payload);
},
approveRejectMounting: async (
  payload: any
) => {
  return api.post(
    "/mounting/approve-reject",
    payload
  );
},
  approveMounting: async (
    payload: any,
  ) => {
    console.log(
      "APPROVE mounting PAYLOAD",
      payload,
    );

    return Promise.resolve();
  },

  rejectMounting: async (
    payload: any,
  ) => {
    console.log(
      "REJECT mounting PAYLOAD",
      payload,
    );

    return Promise.resolve();
  },
};

export default mountingServiceApi;