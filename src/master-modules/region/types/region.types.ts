// export interface Region {
//   id: number;
//   regionName: string;
//   regionInitial: string;
// }

// export interface RegionApiResponse {
//   success: boolean;
//   data: Region[];
//   error: string | null;
// }

export interface Region {
  id: number;
  regionName: string;
  regionInitial: string;
}

export interface RegionPayload {
  regionName: string;
  regionInitial: string;
}

export interface RegionApiResponse {
  success: boolean;
  data: Region[];
  error: string | null;
}

export interface SingleRegionApiResponse {
  success: boolean;
  data: Region;
  error: string | null;
}

export interface RegionActionResponse {
  success: boolean;
  data?: Region | null;
  error: string | null;
}
