export interface User{
  id:number;
  fullname:string;
  username:string;
  role:string;
  email:string;
  phoneNumber:string;
}

export interface UserRegistration{
  fullname:string;
  username:string;
  roleId:number;
  email:string;
  phoneNumber:string;
  password:string;
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
