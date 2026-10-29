import api from "../../../shared/services/api";

const customerService = {
  getAllCustomers: () =>
    api.get("/customers/accessible"),

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

    // Fetch regions for the selected customer
  getCustomerRegions: (customerNumber: string) =>
    api.get(`/customers/${encodeURIComponent(customerNumber)}/regions`),

  // Fetch zones for the selected region
  getAccessibleZones: (regionId: number) =>
    api.get("/zones/accessible", {
      params: { regionId },
    }),
};

export default customerService;