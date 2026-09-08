import api from "../../../shared/services/api";

const holdTyreServiceApi = {
  // =========================================================
  // GET HOLD TYRES
  // =========================================================
  getHoldTyres: (
    casingStage: number,
    casingSubstage?: number,
    includeApproved: boolean = true,
    holdType: number = 1
  ) => {
    return api.get("/holds", {
      params: {
        casingStage,

        ...(casingSubstage !== undefined && {
          casingSubstage,
        }),

        includeApproved,

        holdType,
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
};

export default holdTyreServiceApi;