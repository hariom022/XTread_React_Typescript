import api from "../../../shared/services/api";

const damageLevelService = {
  getAllDamageLevels: () =>
    api.get("/damage-levels"),
};

export default damageLevelService;