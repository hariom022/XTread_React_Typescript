import api from "../../../shared/services/api";

const tyreMakeService = {
  getAllTyreMakes: () =>
    api.get("/tyre-makes"),
};

export default tyreMakeService;