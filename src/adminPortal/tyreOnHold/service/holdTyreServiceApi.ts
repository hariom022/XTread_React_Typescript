import api from "../../../shared/services/api";

const holdTyreServiceApi = {
  // =========================================================
  // GET HOLD TYRES
  // =========================================================
  getHoldTyres: (
    casingStage: number,
    // casingSubstage?: number,
    includeApproved: boolean = false,
    // holdType: number = 1
  ) => {
    return api.get("/holds", {
      params: {
        casingStage,

        // ...(casingSubstage !== undefined && {
        //   casingSubstage,
        // }),

        includeApproved,

        // holdType,
      },
    });
  },

  // =========================================================
  // APPROVE HOLD TYRE
  // =========================================================
  approveHold: (
    holdId: number,
    payload: {
      lpoNumber: string;
      date: string;
      amount: number;
      remarks: string;
    }
  ) => {
    return api.post(
      `/holds/${holdId}/approve`,
      payload
    );
  },

  // =========================================================
  // GET PRE-BUFFING HOLD TYRES
  // =========================================================
  getPreBuffingHoldTyres: () => {
    return api.get("/batches/progress", {
      params: {
        currentStage: 7,
        currentSubstage: 71,
        currentStageStatus: 3,
      },
    });
  },

  // =========================================================
  // GET ORDER CASING DETAILS
  // =========================================================
  getOrderCasingById: (orderCasingId: number) => {
    return api.get(`/orders/casings/${orderCasingId}`);
  },
  // =========================================================
  // GET TREAD PATTERNS FOR APPROVED PATTERN CHANGE
  // =========================================================
  getTreadPatterns: (
    categoryId: number,
    tyreClassificationId: number,
    isRetread: boolean,
    override: boolean
  ) => {
    return api.get("/tread-patterns", {
      params: {
        categoryId,
        tyreClassificationId,
        isRetread,
        override,
      },
    });
  },

  // =========================================================
  // GET TREAD PATTERN VARIANTS
  // =========================================================
  getTreadPatternVariants: (treadPatternId: number) => {
    return api.get(
      `/tread-patterns/${treadPatternId}/variants`
    );
  },
};

export default holdTyreServiceApi;
