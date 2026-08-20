import api from "../../../shared/services/api";
import type { TyreSizeApiResponse } from "../types/tyreSize.types";

// const tyreSizeService = {
//   getAllTyreSizes: () =>
//     api.get<TyreSizeApiResponse>("/tyre-sizes"),
// };

// export default tyreSizeService;


const tyreSizeService = {
  getAllTyreSizes: (categoryId: number = 1) =>
    api.get<TyreSizeApiResponse>(
      `/tyre-sizes?categoryId=${categoryId}`
    ),
};

export default tyreSizeService;