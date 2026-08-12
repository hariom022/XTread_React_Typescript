import api from "../../../shared/services/api";

const serviceTypeService = {
  getAllServiceTypes: () =>
    api.get("/service-types"),
};

export default serviceTypeService;