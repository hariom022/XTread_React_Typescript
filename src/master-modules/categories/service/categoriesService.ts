import api from "../../../shared/services/api";
import type { CategoryApiResponse } from "../types/categories.types";

const categoriesService = {
  getAllCategories: (serviceTypeId: number) =>
    api.get<CategoryApiResponse>(
      `/categories?serviceTypeId=${serviceTypeId}`
    ),
};

export default categoriesService;