
import api from "../../../shared/services/api";

import type {
  CategoryApiResponse,
  TyreMakeApiResponse,
  TreadPatternApiResponse,
} from "../types/pattern.types";

const patternService = {
  getCategories: () =>
    api.get<CategoryApiResponse>("/categories", {
      params: {
        serviceTypeId: 1,
      },
    }),

  getTyreMakes: () =>
    api.get<TyreMakeApiResponse>("/tyre-makes"),

  getPatterns: (categoryId: number, tyreClassificationId: number) =>
    api.get<TreadPatternApiResponse>("/tread-patterns", {
      params: {
        categoryId,
        tyreClassificationId,
      },
    }),
};

export default patternService;
