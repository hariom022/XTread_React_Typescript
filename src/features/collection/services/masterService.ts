import api from "../../../shared/services/api";

const masterService = {
  getServiceTypes: () =>
    api.get("/service-types"),

  getCategories: (
    serviceTypeId: string
  ) =>
    api.get(
      `/categories?serviceTypeId=${serviceTypeId}`
    ),

  getRimSizes: (
    categoryId: number
  ) =>
    api.get(
      `/tyre-sizes/rim-sizes?categoryId=${categoryId}`
    ),

  getTyreSizes: (
    categoryId: number,
    rimSize: string
  ) =>
    api.get(
      `/tyre-sizes?categoryId=${categoryId}&rimSize=${rimSize}`
    ),

  getCasingSizes: (
    categoryId: number,
    rimSize: string
  ) =>
    api.get(
      `/tyre-sizes/casing-sizes?categoryId=${categoryId}&rimSize=${rimSize}`
    ),

  getTyreMakes: () =>
    api.get("/tyre-makes"),

  getPattern: (
    categoryId: number,
    tyreClassificationId: number,
    isRetreaded: boolean,
    override: boolean
  ) =>
    api.get(
      `/tread-patterns?categoryId=${categoryId}&tyreClassificationId=${tyreClassificationId}&isRetread=${isRetreaded}&override=${override}`
    ),

  postSaveOrder: (data: unknown) =>
    api.post("/orders", data),

  addCasingToOrder: (
    orderNumber: string,
    data: unknown
  ) =>
    api.post(
      `/orders/${orderNumber}/casings`,
      data
    ),
};

export default masterService;