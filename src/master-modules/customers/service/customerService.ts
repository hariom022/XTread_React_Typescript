import api from "../../../shared/services/api";
import type {
  CustomerApiResponse,
  RegionApiResponse,
} from "../types/customer.types";

const customerService = {
  getAllCustomers: (
    pageNumber: number = 1,
    pageSize: number = 20,
    regionId?: number
  ) => {
    const params: {
      pageNumber: number;
      pageSize: number;
      regionId?: number;
    } = {
      pageNumber,
      pageSize,
    };

    // All Regions: do not send regionId
    if (regionId !== undefined && regionId !== 0) {
      params.regionId = regionId;
    }

    return api.get<CustomerApiResponse>("/customers", { params });
  },

  getRegions: () =>
    api.get<RegionApiResponse>("/regions"),
};

export default customerService;