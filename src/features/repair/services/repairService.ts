import api from "../../../shared/services/api";

const repairService = {
  getRejectionReasons: () => api.get("/rejection-reasons?currentStage=10"),

  approveReject: (payload: any) =>
    api.post("/repair-stage/approve-reject", payload),

  // NEW APIs
  getRepairLocations: () => api.get("/repair-locations"),

  getDamageTypes: () => api.get("/damage-types"),

  getRepairMaterials: (serviceTypeId?: number) => {
    if (serviceTypeId === 1) {
      return api.get("/repair-materials/1");
    }

    return api.get("/repair-materials");
  },

  getPatchSizes: (repairMaterialId: number) =>
    api.get(`/patch-sizes?repairMaterialId=${repairMaterialId}`),
};

export default repairService;
