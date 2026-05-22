import api from "../../../shared/services/api";

const customerService = {
  getAllCustomers: () =>
    api.get("/customers"),

  getCustomerById: (
    customerNumber: string
  ) =>
    api.get(`/customers/${customerNumber}`),

  searchCustomers: (
    searchTerm: string
  ) =>
    api.get(
      `/customers?search=${searchTerm}`
    ),
};

export default customerService;