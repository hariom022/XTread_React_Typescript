import api from "../../../shared/services/api";

const skivingStageServiceApi = {
  // ================= SKIVING STAGE 1 API =================
  saveSkivingStage1: (payload:any) =>
    api.post("/skiving/stage1", payload),
  // ================= STATION MACHINE API =================
  getMachines: () =>
    api.get("/machines?stage=8"),
  // ================= SKIVING APPROVAL/REJECTION API =================
  saveSkivingApproval: (payload :any) =>
    api.post("/skiving/approval", payload),
  //================== SKIVING REJECTION REASONS API =================
  getSkivingRejectionReasons: () =>
    api.get("/rejection-reasons?currentStage=8"),
};

export default skivingStageServiceApi;