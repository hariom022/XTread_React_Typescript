
// export const buildQualityControlRequest = (
//   orderCasingId: number,
//   action:
//     | "APPROVE_RETREAD"
//     | "SEND_TO_REPAIR"
//     | "RECOVER_RUBBER_APPROVED"
//     | "RECOVER_RUBBER_REJECTED"
//     | "APPROVE_REPAIR"
//     | "REJECT_DISPATCH"
//     | "REJECT_RETURN_REPAIR",
//   rejectionReasonCode?: string
// ): QualityControlRequest => {
//   switch (action) {
//     case "APPROVE_RETREAD":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: true,
//         isRepair: null,
//         isRecoverRubber: null,
//         isRubberRecoveryApproved: null,
//         isRejectedToDispatch: null,
//         rejectionReasonCode: null,
//       };

//     case "SEND_TO_REPAIR":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: false,
//         isRepair: true,
//         isRecoverRubber: null,
//         isRubberRecoveryApproved: null,
//         isRejectedToDispatch: null,
//         rejectionReasonCode : rejectionReasonCode ?? null,
//       };

//     case "RECOVER_RUBBER_APPROVED":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: false,
//         isRepair: null,
//         isRecoverRubber: true,
//         isRubberRecoveryApproved: true,
//         isRejectedToDispatch: null,
//         rejectionReasonCode: null,
//       };

//     case "RECOVER_RUBBER_REJECTED":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: false,
//         isRepair: null,
//         isRecoverRubber: true,
//         isRubberRecoveryApproved: false,
//         isRejectedToDispatch: null,
//         rejectionReasonCode: null,
//       };

//     case "APPROVE_REPAIR":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: true,
//         isRepair: null,
//         isRecoverRubber: null,
//         isRubberRecoveryApproved: null,
//         isRejectedToDispatch: null,
//         rejectionReasonCode: null,
//       };

//     case "REJECT_DISPATCH":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: false,
//         isRepair: null,
//         isRecoverRubber: null,
//         isRubberRecoveryApproved: null,
//         isRejectedToDispatch: true,
//         rejectionReasonCode : rejectionReasonCode ?? null,
//       };

//     case "REJECT_RETURN_REPAIR":
//       return {
//         orderCasingIds: [orderCasingId],
//         isApproved: false,
//         isRepair: null,
//         isRecoverRubber: null,
//         isRubberRecoveryApproved: null,
//         isRejectedToDispatch: false,
//         rejectionReasonCode : rejectionReasonCode ?? null,
//       };

//     default:
//       throw new Error("Invalid action");
//   }
// };
import {type QualityControlRequest} from "../type/qualityControl.type"


type QualityControlAction =
  | "APPROVE"
  | "SEND_TO_SKIVING"
  | "SEND_TO_REPAIR"
  | "SEND_TO_DISPATCH"
  | "RECOVER_RUBBER_APPROVED"
  | "RECOVER_RUBBER_REJECTED";

export const buildQualityControlRequest = (
  orderCasingId: number,
  action: QualityControlAction,
  rejectionReasonCode?: string
): QualityControlRequest => {
  switch (action) {
    case "APPROVE":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: true,
        destinationStage: null,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        rejectionReasonCode: null,
      };

    case "SEND_TO_SKIVING":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        destinationStage: 8,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        rejectionReasonCode: rejectionReasonCode ?? null,
      };

    case "SEND_TO_REPAIR":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        destinationStage: 10,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        rejectionReasonCode: rejectionReasonCode ?? null,
      };

    case "SEND_TO_DISPATCH":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        destinationStage: 16,
        isRecoverRubber: null,
        isRubberRecoveryApproved: null,
        rejectionReasonCode: rejectionReasonCode ?? null,
      };

    case "RECOVER_RUBBER_APPROVED":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        destinationStage: null,
        isRecoverRubber: true,
        isRubberRecoveryApproved: true,
        rejectionReasonCode: null,
      };

    case "RECOVER_RUBBER_REJECTED":
      return {
        orderCasingIds: [orderCasingId],
        isApproved: false,
        destinationStage: null,
        isRecoverRubber: true,
        isRubberRecoveryApproved: false,
        rejectionReasonCode: null,
      };

    default:
      throw new Error(`Unknown Quality Control action: ${action}`);
  }
};