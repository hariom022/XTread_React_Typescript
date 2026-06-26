import api from "../../../shared/services/api";

const envelopingServiceApi = {
  /* ==========================
      INDEX PAGE DATA
  ========================== */

  getEnvelopingOrders: () =>
    api.get(
      "/batches/progress?currentStage=13&currentStageStatus=1"
    ),
    getEnvelopingOrdersLoaded: () =>
    api.get(
      "/batches/progress?currentStage=13&currentStageStatus=5"
    ),
  getRailsTypes:()=>
    api.get("/rails"),
  getRailPipes : (railId: number) =>
  api.get(`/rails/${railId}/pipes`),

   deletePipe:(pipeId: number) =>
  api.delete(`/rails/pipes/${pipeId}`),
   
  /* ==========================
      API PENDING
  ========================== */

assignEnvelope(payload: {
  casings: {
    orderCasingId: string;
    railId: string;
    railPipeId: string;
  }[];
}) {
  return api.post("/enveloping/assign", payload);
},
approveRejectEnvelope: async (
  payload: any
) => {
  return api.post(
    "/enveloping/approve-reject",
    payload
  );
},
  approveEnvelope: async (
    payload: any,
  ) => {
    console.log(
      "APPROVE ENVELOPE PAYLOAD",
      payload,
    );

    return Promise.resolve();
  },

  rejectEnvelope: async (
    payload: any,
  ) => {
    console.log(
      "REJECT ENVELOPE PAYLOAD",
      payload,
    );

    return Promise.resolve();
  },
};

export default envelopingServiceApi;