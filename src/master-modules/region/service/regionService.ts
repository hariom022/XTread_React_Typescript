import api from "../../../shared/services/api";
import type { RegionApiResponse } from "../types/region.types";

const regionService = {
  getAllRegions: () => api.get<RegionApiResponse>("/regions"),
};

export default regionService;