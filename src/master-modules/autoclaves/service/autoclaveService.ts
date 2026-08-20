import api from "../../../shared/services/api";

const autoclaveService = {
  getAllAutoclaves: () =>
    api.get("/autoclaves"),
};

export default autoclaveService;