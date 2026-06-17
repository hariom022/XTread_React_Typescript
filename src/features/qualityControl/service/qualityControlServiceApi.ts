import api from "../../../shared/services/api";

const qualityControlServiceApi = {
/**REJECT RESON CODE GET API */
getRejectionReason:()=>
    api.get(`rejection-reasons?currentStage=${15}`),
/**APPROVE REJECT POST API */
};

export default qualityControlServiceApi;