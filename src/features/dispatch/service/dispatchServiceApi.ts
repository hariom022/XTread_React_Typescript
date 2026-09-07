import api from "../../../shared/services/api";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import type {
  AddCourierPayload,
  DeliverySheetPayload,
} from "../type/dispatch.types";

const dispatchServiceApi = {
  /* casing comes from QC */
  getApprovedFromQC: () => indexPageApiService.getBatchProgress(16, 1),


/** GET Courier Services by Courier Type
 *  Internal = 2
 *  External = 1
 */
getCourierServices: (courierType: number) =>
  api.get(`/courier-services?courierType=${courierType}`),


  /**Get Courier Services By ID */
  getCourierServiceById: (courierServiceId: number) =>
    api.get(`/courier-services?courierServiceId=${courierServiceId}`),

  /**Get Vehicle by courier service id */
  getVehicleByCourierServiceId: (courierServiceId: number) =>
    api.get(`/courier-services/${courierServiceId}/vehicles`),
  /**Post Api for ADD COURIER */
  saveCourier: (payload: AddCourierPayload, courierServiceId: number) =>
    api.post(`/courier-services/${courierServiceId}/vehicles`, payload),

  /**Get Customers */
  getCustomerName: () => api.get(`/customers`),

  /**Get Service Type */
  getServiceTypeName: () => api.get(`/service-types`),

  /** POST Save Customer Delivery Sheet */
  saveDeliverySheet: (payload: DeliverySheetPayload) =>
    api.post(`/delivery-sheets`, payload),

  /** GET Delivery Sheets */
  getDeliverySheets: () => api.get(`/delivery-sheets?isApproved=false`),

  /** POST Dispatch / Finalize Delivery Sheet */
  dispatchDeliverySheet: (deliverySheetId: number) =>
    api.post(`/delivery-sheets/${deliverySheetId}/dispatch`),

  // ==========================================
  // DISPATCH INDEX TABLE
  // Stage 16 / Status 2
  // ==========================================

  /** GET Approved Delivery Sheets */
  getApprovedCasingOnDispatch: () =>
    api.get(`/delivery-sheets?isApproved=true`),

  /** GET Delivery Sheet Details */
  getDeliverySheetById: (deliverySheetId: number) =>
    api.get(`/delivery-sheets/${deliverySheetId}`),

  /* ==========================================
     UPDATE DELIVERY SHEET
     ========================================== */

  updateDeliverySheet: (
    deliverySheetId: number,
    payload: {
      courierType: number;

      courierServiceId: string;

      courierName: string | null;

      vehicleRegNo: string | null;

      driverName: string | null;

      driverIdNo: string | null;

      remarks: string;

      addOrderCasingIds: number[];

      removeOrderCasingIds: number[];
    },
  ) => api.put(`/delivery-sheets/${deliverySheetId}`, payload),

  /** GET Drivers by Courier Service */
getDriversByCourierServiceId: (courierServiceId: number) =>
  api.get(`/drivers?courierServiceId=${courierServiceId}`),
};
export default dispatchServiceApi;
