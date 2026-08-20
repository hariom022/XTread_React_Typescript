import api from "../../../shared/services/api";

const rejectionReasonService = {
  getAllRejectionReasons: () =>
    api.get("/rejection-reasons"),
};

export default rejectionReasonService;