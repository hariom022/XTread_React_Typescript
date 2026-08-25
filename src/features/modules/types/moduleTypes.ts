export interface ModuleItem {
  id: number;
  moduleCode: string;
  moduleName: string;
  parentModuleId: number | null;
  route: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  children: ModuleItem[];
}

export interface ModuleTreeResponse {
  success: boolean;
  data: {
    modules: ModuleItem[];
  };
  error: string | null;
}