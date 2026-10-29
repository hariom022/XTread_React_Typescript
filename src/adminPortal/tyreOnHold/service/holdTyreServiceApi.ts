import api from "../../../shared/services/api";

const holdTyreServiceApi = {

  getNailInspectionHoldOrders: async (): Promise<any> => {
    return api.get("/nail-inspection/holds/pending-orders");
  },
  //Release/approve Hold from nail inspection hold order
  approveNailInspectionHoldOrder: (
    orderId: number,
    referenceNumber: string,
  ) => {
    return api.post(
      `/nail-inspection/holds/orders/${orderId}/approve`,
      { referenceNumber },
    );
  },


  //rejection reason api:

  getNailInspectionHoldRejectionReasons: () => {
    return api.get("/rejection-reasons", {
      params: {
        currentStage: 4,
        category: "Hold Reason",
      },
    });
  },

  //REJECT NAIL INSPECTION HOLD ORDER
  rejectNailInspectionHoldOrder: (
    orderId: number,
    rejectionReasonId: number,
  ) => {
    return api.post(
      `/nail-inspection/holds/orders/${orderId}/reject`,
      { rejectionReasonId },
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
    override: boolean,
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
    return api.get(`/tread-patterns/${treadPatternId}/variants`);
  },

  validateFinishedMaterial: (tyreSize: string, pattern: string) =>
    api.get(
      `/materials/validate-finished-material?${new URLSearchParams({
        tyreSize,
        pattern,
      }).toString()}`,
    ),

  getSuggestedPattern: (orderCasingId: number) =>
    api.get(`/pre-buffing/${orderCasingId}/suggested-pattern`),


  approvePreBuffingHold: (
    orderCasingId: number,
    payload: {
      treadPatternId: number;
      treadPatternVariantId: number;
      remarks: null;
    },
  ) =>
    api.post(
      `/pre-buffing/holds/${orderCasingId}/approve`,
      payload,
    ),

  rejectPreBuffingHold: (
    orderCasingId: number,
    payload: {
      remarks: string;
    },
  ) =>
    api.post(
      `/pre-buffing/holds/${orderCasingId}/reject`,
      payload,
    ),

};

export default holdTyreServiceApi;
