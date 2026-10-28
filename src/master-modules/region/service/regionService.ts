// import api from "../../../shared/services/api";
// import type { RegionApiResponse } from "../types/region.types";

// const regionService = {
//   getAllRegions: () => api.get<RegionApiResponse>("/regions"),
// };

// export default regionService;

import api from "../../../shared/services/api";
import type {
  RegionApiResponse,
  SingleRegionApiResponse,
  RegionActionResponse,
  RegionPayload,
} from "../types/region.types";

const regionService = {
  getAllRegions: () =>
    api.get<RegionApiResponse>("/regions"),

  getRegionById: (regionId: number) =>
    api.get<SingleRegionApiResponse>(`/regions/${regionId}`),

  createRegion: (payload: RegionPayload) =>
    api.post<RegionActionResponse>("/regions", payload),

  updateRegion: (
    regionId: number,
    payload: RegionPayload
  ) =>
    api.put<RegionActionResponse>(
      `/regions/${regionId}`,
      payload
    ),

  deleteRegion: (regionId: number) =>
    api.delete<RegionActionResponse>(`/regions/${regionId}`),
};

export default regionService;
