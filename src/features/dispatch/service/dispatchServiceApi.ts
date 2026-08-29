import api from "../../../shared/services/api";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import type { AddCourierPayload } from "../type/dispatch.types";

const dispatchServiceApi = {
    /* casing comes from QC */
    getApprovedFromQC : () => indexPageApiService.getBatchProgress(16, 1),

    /**GET Courier Services */
    getCourierServices : () => api.get(`/courier-services`),

    /**Get Courier Services By ID */
    getCourierServiceById : (courierServiceId: number) => 
        api.get(`/courier-services?courierServiceId=${courierServiceId}`),

    /**Get Vehicle by courier service id */
    getVehicleByCourierServiceId : (courierServiceId: number) =>
        api.get(`/courier-services/${courierServiceId}/vehicles`),
    /**Post Api for ADD COURIER */
    saveCourier: (payload:AddCourierPayload, courierServiceId:number)=> 
        api.post(`/courier-services/${courierServiceId}/vehicles`, payload),

    /**Get Customers */
    getCustomerName : () => api.get(`/customers`),

    /**Get Service Type */
    getServiceTypeName : () => api.get(`/service-types`),

};
export default dispatchServiceApi;