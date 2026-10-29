import api from "../../../shared/services/api";

const holdTyreServiceApi = {
  // // =========================================================
  // // GET HOLD TYRES
  // // =========================================================
  // getHoldTyres: (
  //   casingStage: number,
  //   // casingSubstage?: number,
  //   includeApproved: boolean = false,
  //   // holdType: number = 1
  // ) => {
  //   return api.get("/holds", {
  //     params: {
  //       casingStage,

  //       // ...(casingSubstage !== undefined && {
  //       //   casingSubstage,
  //       // }),

  //       includeApproved,

  //       // holdType,
  //     },
  //   });
  // },

  // // =========================================================
  // // APPROVE HOLD TYRE
  // // =========================================================
  // approveHold: (
  //   holdId: number,
  //   payload: {
  //     lpoNumber: string;
  //     date: string;
  //     amount: number;
  //     remarks: string;
  //   }
  // ) => {
  //   return api.post(
  //     `/holds/${holdId}/approve`,
  //     payload
  //   );
  // },

  getNailInspectionHoldOrders: async (): Promise<any> => {
     return api.get("/nail-inspection/holds/pending-orders");
  },
approveNailInspectionHoldOrder: (orderId: number) => {
  return api.post(
    `/nail-inspection/holds/orders/${orderId}/approve`
  );
},

  // submitNailInspectionHoldAction: async (
  //   _payload: import("../types/nailInspectionHold.types").NailInspectionHoldActionPayload,
  // ): Promise<any> => {
  //   throw new Error("Nail Inspection Hold action API is not implemented yet.");
  // },

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
