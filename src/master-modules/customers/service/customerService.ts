import api from "../../../shared/services/api"

const customerService = {
  getAllCustomers: () =>
    api.get("/customers"),
};

export default customerService;