
import api from "../../../shared/services/api";


const addCasingService = {
  addCasing: (orderNumber: string, payload: unknown) =>
    api.post(
      `/orders/${encodeURIComponent(orderNumber)}/casings`,
      payload,
    ),
};


export default addCasingService;
