import api from "../../../shared/services/api";

const repairMaterialService = {
  getAllRepairMaterials: () =>
    api.get("/repair-materials"),
};

export default repairMaterialService;