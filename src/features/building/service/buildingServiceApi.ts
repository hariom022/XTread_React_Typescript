import api from "../../../shared/services/api";
import { apiRequest } from "../../../shared/services/apiClient";

const buildingServiceApi = {
  // Width dropdown depends on pattern
  getWidth: (treadPatternId: number) =>
    api.get(`/tread-patterns/${treadPatternId}/variants`),
  /**Approved Button API */
  // APPROVE
  approveReject: (payload: {
    orderCasingIds: number[];
    isApproved: boolean;
    width: string | null;
    rejectionReasonId: string;
    materialConsumptions: {
      prodHierarchy4: string;
      material: string;
      consumptionType: number;
    }[];
  }) => api.post("/building/approve-reject", payload),
  // RETURN TO REPAIR button api
  sendToRepair: (payload: { orderCasingIds: number[] }) =>
    api.post("/building/send-to-repair", payload),

  getRubber: (prodHierarchy4: string) =>
    api.get(`/materials?$prodHierarchy4=${prodHierarchy4}`),
  getCushionGum: (prodHierarchy4: string) =>
    api.get(`/materials?prodHierarchy4=${prodHierarchy4}`),
};

export default buildingServiceApi;
