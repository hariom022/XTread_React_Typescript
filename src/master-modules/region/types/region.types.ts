export interface Region {
  id: number;
  regionName: string;
  regionInitial: string;
}

export interface RegionApiResponse {
  success: boolean;
  data: Region[];
  error: string | null;
}