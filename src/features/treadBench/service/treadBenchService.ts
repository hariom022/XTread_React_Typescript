import api from "../../../shared/services/api"; // adjust path if needed

const getCementTypes = async () => {
  return await api.get("/cement-types");
};

const saveCementTypes = async (payload: any) => {
  return await api.post(
    "/treadbench-cutting/save",
    payload
  );
};

// const approveCementing = async (
//   payload: any
// ) => {
//   return await api.post(
//     "/cementing/approve",
//     payload
//   );
// };

const cementingService = {
  getCementTypes,
  saveCementTypes,
};

export default cementingService;