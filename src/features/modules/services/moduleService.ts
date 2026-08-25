import { apiRequest } from "../../../shared/services/apiClient";

import type {
  ModuleTreeResponse,
} from "../types/moduleTypes";

const moduleService = {
  async getModuleTree(): Promise<ModuleTreeResponse> {
    return apiRequest<ModuleTreeResponse>(
      "/modules/tree"
    );
  },
};

export default moduleService;