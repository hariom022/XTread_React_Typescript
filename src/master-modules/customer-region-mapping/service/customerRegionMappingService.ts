
import api from "../../../shared/services/api";

const customerRegionMappingService = {
  // Fetch all customers across paginated API responses
  getCustomers: async () => {
    const pageSize = 100;
    let pageNumber = 1;
    let allCustomers: any[] = [];
    let totalPages = 1;

    do {
      const response = await api.get("/customers", {
        params: {
          pageNumber,
          pageSize,
        },
      });

      const data = response.data?.data;

      const items = data?.items ?? [];
      allCustomers = [...allCustomers, ...items];

      totalPages = data?.totalPages ?? 1;
      pageNumber++;
    } while (pageNumber <= totalPages);

    return {
      data: {
        data: {
          items: allCustomers,
        },
      },
    };
  },


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
