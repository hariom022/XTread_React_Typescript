// export interface Zone {
//   id: number;
//   zoneName: string;
//   zoneInitial: string;
//   regionId: number;
//   regionName: string;
// }

// export interface ZoneApiResponse {
//   success: boolean;
//   data: Zone[];
//   error: string | null;
// }

export interface Zone {
  id: number;
  zoneName: string;
  zoneInitial: string;
  regionId: number;
  regionName: string;
}

export interface ZonePayload {
  zoneName: string;
  zoneInitial: string;
  regionId: number;
}

export interface ZoneApiResponse {
  success: boolean;
  data: Zone[];
  error: string | null;
}

export interface SingleZoneApiResponse {
  success: boolean;
  data: Zone;
  error: string | null;
}

export interface ZoneActionResponse {
  success: boolean;
  data?: Zone | null;
  error: string | null;
}
