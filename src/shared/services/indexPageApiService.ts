import api from "./api";

const indexPageApiService = {
  getIndexPageOrders: (
    casingStage: number,
    status: number,
    params: Record<string, any> = {}
  ) =>
    api.get("/orders", {
      params: {
        ...params,
        casingStage,
        status,
      },
    }),
};

export default indexPageApiService;