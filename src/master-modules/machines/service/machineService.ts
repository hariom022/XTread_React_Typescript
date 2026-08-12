import api from "../../../shared/services/api";

const machineService = {
  getAllMachines: () =>
    api.get("/machines"),
};

export default machineService;