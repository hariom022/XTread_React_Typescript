//import api from "./api";

// const indexPageApiService = {
//   getBatchProgress: (currentStage: number, currentStageStatus: number) =>
//     api.get("/batches/progress", {
//       params: {
//         currentStage,
//         currentStageStatus,
//       },
//     }),

//   getOrderCasingDetails: (orderCasingId: number) =>
//     api.get(`/orders/casings/${orderCasingId}`),
// };

// export default indexPageApiService;

import api from "./api";

const indexPageApiService = {
  //For Index Page to show orders when approved from previous stage//
  getBatchProgress: (
    currentStage: number,
    currentStageStatusOrSubstage?: number,
    currentStageStatus?: number
  ) => {
    const params: any = {
      currentStage,
    };

    // OLD MODULES
    // getBatchProgress(3, 1)
    if (
      currentStageStatus !== undefined
    ) {
      params.currentSubstage =
        currentStageStatusOrSubstage;

      params.currentStageStatus =
        currentStageStatus;
    }

    // OLD BEHAVIOR
    else if (
      currentStageStatusOrSubstage !== undefined
    ) {
      params.currentStageStatus =
        currentStageStatusOrSubstage;
    }

    console.log(
      "BATCH PROGRESS PARAMS",
      params
    );

    return api.get("/batches/progress", {
      params,
    });
  },

  // this api used for INSPECT BUTTON then pop up is opening //
  getOrderCasingDetails: (
    orderCasingId: number
  ) =>
    api.get(
      `/orders/casings/${orderCasingId}`
    ),
    
};

export default indexPageApiService;