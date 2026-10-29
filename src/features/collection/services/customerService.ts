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

   // Fetch all accessible regions and their zones.
  getAccessibleRegions: () =>
    api.get("/zones/accessible"),

  // Fetch accessible regions/zones filtered by region ID.
  getAccessibleZones: (regionId: number) =>
    api.get("/zones/accessible", {
      params: { regionId },
    }),
};

export default customerService;