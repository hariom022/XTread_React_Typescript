import api from "../../../shared/services/api";

/* =========================================
   STAGE 1
========================================= */
export interface DamageType {
  id: number;
  name: string;
}
export interface RepairLocation {
  id: number;
  name: string;
}

export interface SaveSkivingStage1Payload {
  orderCasingIds: number[];

  isApproved: boolean;

  machineId: string | number;

  rejectionReasonCode: string | null;

  repairOperations: {
    repairType: string;
    repairLocation: string;
    quantity: number;
  }[] | null;
}

/* =========================================
   APPROVAL
========================================= */

export interface SaveSkivingApprovalPayload {
  orderCasingIds: number[];

  isApproved: boolean;

  isRepeatSkiving: boolean;

  rejectionReasonCode: string | null;

  skipRepair: boolean;
}

/* =========================================
   SERVICE
========================================= */

const skivingStageServiceApi = {
  /* ==========================
      SKIVING STAGE 1
  ========================== */

  saveSkivingStage1: (
    payload: SaveSkivingStage1Payload,
  ) => api.post("/skiving/stage1", payload),

  /* ==========================
      STATION MACHINES
  ========================== */

  getMachines: () =>
    api.get("/machines?stage=8"),

  /* ==========================
    DAMAGE TYPES
========================== */

  getDamageTypes: () =>
    api.get("/damage-types"),

  /**=======================
   * REPAIR LOCATION
   ========================*/
   getRepairLocations:()=>
    api.get("/repair-locations"),

  /* ==========================
      SKIVING APPROVAL
  ========================== */

  saveSkivingApproval: (
    payload: SaveSkivingApprovalPayload,
  ) => api.post("/skiving/approval", payload),

  /* ==========================
      REJECTION REASONS
  ========================== */

  getSkivingRejectionReasons: () =>
    api.get("/rejection-reasons?currentStage=8"),
};

export default skivingStageServiceApi;