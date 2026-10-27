export interface Zone {
  id: number;
  zoneName: string;
  zoneInitial: string;
  regionId: number;
  regionName: string;
}

export interface ZoneApiResponse {
  success: boolean;
  data: Zone[];
  error: string | null;
}