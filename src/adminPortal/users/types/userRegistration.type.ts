
export interface Region {
  id: number;
  regionName: string;
  regionInitial: string;
}

export interface RegionsResponse {
  success: boolean;
  data: Region[];
  error?: unknown;
}

export interface User {
  userId: string;
  fullName: string;
  userName: string;
  roleName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  regionIds?: number[];
   regions: Region[];
}

export interface UserRegistration {
  fullname: string;
  username: string;
  roleId: number;
  email: string;
  phoneNumber: string;
  password: string;
  emailConfirmed: boolean;
  regionIds: number[];
}

export interface UserUpdate {
  fullname: string;
  username: string;
  roleId: number;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  regionIds: number[];
}


export interface Role {
  id: number;
  roleName: string;
  description?: string;
  isSuperAdmin?: boolean;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

export interface UserResponse {
  success: boolean;
  data: User[];
  error?: unknown;
}