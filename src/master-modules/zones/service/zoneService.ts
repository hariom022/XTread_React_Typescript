
import api from "../../../shared/services/api";
import type {
  ZoneApiResponse,
  SingleZoneApiResponse,
  ZoneActionResponse,
  ZonePayload,
} from "../types/zone.types";
import type { RegionApiResponse } from "../../region/types/region.types";

const zoneService = {
  getAllZones: () =>
    api.get<ZoneApiResponse>("/zones"),

  getZoneById: (zoneId: number) =>
    api.get<SingleZoneApiResponse>(`/zones/${zoneId}`),

  createZone: (payload: ZonePayload) =>
    api.post<ZoneActionResponse>("/zones", payload),

  updateZone: (zoneId: number, payload: ZonePayload) =>
    api.put<ZoneActionResponse>(`/zones/${zoneId}`, payload),

  deleteZone: (zoneId: number) =>
    api.delete<ZoneActionResponse>(`/zones/${zoneId}`),

  getRegions: () =>
    api.get<RegionApiResponse>("/regions"),
};

export default zoneService;
