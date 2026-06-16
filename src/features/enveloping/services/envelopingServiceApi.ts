import api from "../../../shared/services/api";

const envelopingServiceApi = {
  /* ==========================
      INDEX PAGE DATA
  ========================== */

  getEnvelopingOrders: () =>
    api.get(
      "/batches/progress?currentStage=13&currentStageStatus=1"
    ),

  /* ==========================
      API PENDING
  ========================== */

  processEnvelope: async (
    payload: any,
  ) => {
    console.log(
      "PROCESS ENVELOPE PAYLOAD",
      payload,
    );

    return Promise.resolve();
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