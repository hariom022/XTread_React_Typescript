import {type QualityControlRequest} from "../type/qualityControl.type"
export const buildQualityControlRequest = (
  orderCasingId: number,
  action:
    | "APPROVE_RETREAD"
    | "SEND_TO_REPAIR"
    | "RECOVER_RUBBER_APPROVED"
    | "RECOVER_RUBBER_REJECTED"
    | "APPROVE_REPAIR"
    | "REJECT_DISPATCH"
    | "REJECT_RETURN_REPAIR",
  rejectionReasonCode?: string
): QualityControlRequest => {
  switch (action) {
    case "APPROVE_RETREAD":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: true,
        isRepair: null,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        isRejectedToDispatch: null,
        rejectionReasonCode: null,
      };

    case "SEND_TO_REPAIR":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        isRepair: true,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        isRejectedToDispatch: null,
        rejectionReasonCode : rejectionReasonCode ?? null,
      };

    case "RECOVER_RUBBER_APPROVED":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        isRepair: null,
        isRecoverRubber: true,
        isRubberRecoveryApproved: true,
        isRejectedToDispatch: null,
        rejectionReasonCode: null,
      };

    case "RECOVER_RUBBER_REJECTED":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        isRepair: null,
        isRecoverRubber: true,
        isRubberRecoveryApproved: false,
        isRejectedToDispatch: null,
        rejectionReasonCode: null,
      };

    case "APPROVE_REPAIR":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: true,
        isRepair: null,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        isRejectedToDispatch: null,
        rejectionReasonCode: null,
      };

    case "REJECT_DISPATCH":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        isRepair: null,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        isRejectedToDispatch: true,
        rejectionReasonCode : rejectionReasonCode ?? null,
      };

    case "REJECT_RETURN_REPAIR":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        isRepair: null,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        isRejectedToDispatch: false,
        rejectionReasonCode : rejectionReasonCode ?? null,
      };

    default:
      throw new Error("Invalid action");
  }
};