import api from "../../../shared/services/api";
import type { ZoneApiResponse } from "../types/zone.types";

const zoneService = {
  getAllZones: () => api.get<ZoneApiResponse>("/zones"),
};

export default zoneService;