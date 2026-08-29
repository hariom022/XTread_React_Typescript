import api from "../../../shared/services/api";

const holdTyreServiceApi = {
  getHoldTyres: () =>
    api.get("/batches/progress", {
      params: {
        currentStage: 4,
        currentStageStatus: 3,
      },
    }),
};

export default holdTyreServiceApi;