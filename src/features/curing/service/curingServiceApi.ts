import indexPageApiService from "../../../shared/services/indexPageApiService";
import api from "../../../shared/services/api";

const curingServiceApi = {
  /*
    APPROVED FROM ENVELOPING
    STAGE = 14
  */
  getApprovedFromEnveloping: () => indexPageApiService.getBatchProgress(14, 1),

  /*
    FUTURE API
  */

  loadCuring: (payload: any) => Promise.resolve(payload),

  loadAutoClaves: () => api.get("/autoclaves"),

  loadAutoClavePipes: (autoclaveId: number) =>
    api.get(`/autoclaves/${autoclaveId}/pipes`),

  startCure: (payload: any) => api.post("/curing/start-cure", payload),

  unloadCure: (payload: any) => api.post("/curing/unload-cure", payload),

  finishCure: (payload: any) => api.post("/curing/finish-cure", payload),

  cancelCure: (payload: any) => api.post("/curing/cancel-cure", payload),
  moveCuring: (payload: any) => api.post("/curing/move", payload),
};

export default curingServiceApi;
