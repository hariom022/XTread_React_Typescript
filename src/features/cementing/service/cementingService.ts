import api from "../../../shared/services/api";

const cementingService = {

  getCementTypes: () =>
    api.get("/cement-types"),

  saveCementing: (data:any) =>
    api.post("/cementing/save", data),

  approveCementing: (data:any) =>
    api.post("/cementing/approve", data),

};

export default cementingService;