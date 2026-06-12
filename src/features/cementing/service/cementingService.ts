import api from "../../../shared/services/api"; // adjust path if needed

const getCementTypes = async () => {
  return await api.get("/cement-types");
};

const saveCementing = async (payload: any) => {
  return await api.post(
    "/cementing/save",
    payload
  );
};

const approveCementing = async (
  payload: any
) => {
  return await api.post(
    "/cementing/approve",
    payload
  );
};

const cementingService = {
  getCementTypes,
  saveCementing,
  approveCementing,
};

export default cementingService;