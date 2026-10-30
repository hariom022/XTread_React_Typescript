
import api from "../../../shared/services/api";

const customerRegionMappingService = {
  getCustomers: () => api.get("/customers"),

  getRegions: () => api.get("/regions"),

   // Get all customer-region mappings
  getAllCustomerRegions: () => api.get("/customers/regions"),

  getCustomerRegions: (customerNumber: string) =>
    api.get(
      `/customers/${encodeURIComponent(customerNumber)}/regions`
    ),

  saveCustomerRegions: (
    customerNumber: string,
    regionIds: number[]
  ) =>
    api.post(
      `/customers/${encodeURIComponent(customerNumber)}/regions`,
      { regionIds }
    ),

    // Update an existing customer-region mapping
  updateCustomerRegions: (
    customerNumber: string,
    regionIds: number[]
  ) =>
    api.put(
      `/customers/${encodeURIComponent(customerNumber)}/regions`,
      { regionIds }
    ),
};

export default customerRegionMappingService;
