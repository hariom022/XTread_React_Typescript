import indexPageApiService from "../../../shared/services/indexPageApiService";

const curingServiceApi = {
  /*
    APPROVED FROM ENVELOPING
    STAGE = 14
  */
  getApprovedFromEnveloping:
    () =>
      indexPageApiService.getBatchProgress(14,1),

  /*
    FUTURE API
  */

  loadCuring: (
    payload: any,
  ) =>
    Promise.resolve(
      payload,
    ),
};

export default curingServiceApi;