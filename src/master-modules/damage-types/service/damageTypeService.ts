import api from "../../../shared/services/api";

const damageTypeService = {
  getAllDamageTypes: () =>
    api.get("/damage-types"),
};

export default damageTypeService;