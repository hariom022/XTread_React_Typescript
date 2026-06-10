import api from "../../../shared/services/api";

import type {
  SaveSkivingStage1Payload,
} from "../types/skivingStage1Types";

import type {
  SaveSkivingApprovalPayload,
} from "../types/skivingApprovalTypes";

const skivingStageServiceApi = {
  // ================= SKIVING STAGE 1 =================
  saveSkivingStage1: (
    payload: SaveSkivingStage1Payload
  ) =>
    api.post(
      "/skiving/stage1",
      payload
    ),

  // ================= MACHINES =================
  getMachines: () =>
    api.get(
      "/machines?stage=8"
    ),

  // ================= SKIVING APPROVAL =================
  saveSkivingApproval: (
    payload: SaveSkivingApprovalPayload
  ) =>
    api.post(
      "/skiving/approval",
      payload
    ),

  // ================= REJECTION REASONS =================
  getSkivingRejectionReasons: () =>
    api.get(
      "/rejection-reasons?currentStage=8"
    ),
};

export default skivingStageServiceApi;