import api from "../../../shared/services/api";

const buffingStageServiceApi = {
  getPreBuffingRejectionReason: () =>
    api.get(
      "/rejection-reasons?currentStage=7&currentSubstage=71&category=Rejection",
    ),

  getSuggestedPatterns: (orderCasingId: number) =>
    api.get(`/tread-patterns/suggestions?orderCasingId=${orderCasingId}`),

  approveRejectPreBuffing: (data: any) =>
    api.post("/pre-buffing/approve-reject", data),

  getPreBuffingHoldReason: () =>
    api.get(
      "/rejection-reasons?currentStage=7&currentSubstage=71&category=Hold Reason",
    ),

  getPostBuffingRejectionReason: () =>
    api.get("/rejection-reasons?currentStage=7&currentSubstage=72"),

  getMachines: () => api.get("/machines?stage=7"),

  getDamageLevels: () => api.get("/damage-levels"),

  getPatternVariants: (treadPatternId: number) =>
    api.get(`/tread-patterns/${treadPatternId}/variants`),

  approveRejectPostBuffing: (data: any) =>
    api.post("/post-buffing/approve-reject", data),
  
  getOrderCasingById: (orderCasingId: number) =>
    api.get(`/orders/casings/${orderCasingId}`),
};

export default buffingStageServiceApi;
