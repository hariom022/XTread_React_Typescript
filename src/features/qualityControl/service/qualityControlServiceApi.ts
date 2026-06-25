import api from "../../../shared/services/api";
import {type QualityControlRequest} from "../type/qualityControl.type"

const qualityControlServiceApi = {
/**REJECT RESON CODE GET API */
// getRejectionReason:()=>
//     api.get(`rejection-reasons?currentStage=${15}`),
approveReject: async (
  payload: QualityControlRequest
) => {
  return api.post(
    "/quality-control/process",
    payload
  );
},
/**APPROVE REJECT POST API */
};

export default qualityControlServiceApi;