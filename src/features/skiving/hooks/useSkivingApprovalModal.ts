import { useEffect, useState } from "react";
import { Modal } from "bootstrap";

import skivingStageServiceApi from "../service/skivingStageServiceApi";
import type { SkivingApprovalRow } from "../types/skivingApproval.types";
import { getSkivingApprovalErrorMessage } from "../utils/getSkivingApprovalErrorMessage";

interface RejectionReason {
  rejectionReasonId: number;
  code: string;
  reason: string;
}

interface Props {
  selectedItem: SkivingApprovalRow | null;
  refreshTable: () => void;
}

const useSkivingApprovalModal = ({
  selectedItem,
  refreshTable,
}: Props) => {
  const [
    repeatSkiving,
    setRepeatSkiving,
  ] =
    useState(false);

  const [
    skipRepair,
    setSkipRepair,
  ] =
    useState(false);

  const [rejectionReason, setRejectionReason,] = useState<number | null>(null);

  const [
    rejectionReasons,
    setRejectionReasons,
  ] =
    useState<
      RejectionReason[]
    >([]);

  /* =====================
      FETCH REASONS
  ====================== */

  const fetchRejectionReasons =
    async () => {
      try {
        const response =
          await skivingStageServiceApi.getSkivingRejectionReasons();

        setRejectionReasons(
          response.data.data ||
          [],
        );
      } catch (error) {
        console.error(
          error,
        );
      }
    };

  useEffect(() => {
    fetchRejectionReasons();
  }, []);

  /* =====================
      AUTO SKIP
  ====================== */

  useEffect(() => {
    const hasRepairs =
      (selectedItem?.repairOperations?.length || 0) > 0;

    setSkipRepair(!hasRepairs);
  }, [selectedItem]);
  /* =====================
      RESET
  ====================== */

  const resetModal =
    () => {
      setRepeatSkiving(
        false,
      );

      setSkipRepair(
        false,
      );

      setRejectionReason(
        null,
      );
    };

  /* =====================
      APPROVE
  ====================== */

  const handleApprove =
    async () => {
      try {
        if (
          !selectedItem
        )
          return;

        const payload =
        {
          orderCasingIds:
            [
              selectedItem.id,
            ],

          isApproved:
            true,

          isRepeatSkiving:
            repeatSkiving,

          rejectionReasonId:
            null,

          skipRepair:
            skipRepair,
        };
        console.log("SKIVING APPROVAL STAGE 2 REPONSE", JSON.stringify(payload, null, 2),);
        await skivingStageServiceApi.saveSkivingApproval(
          payload,
        );

        alert(
          "Approved Successfully",
        );

        refreshTable();
        const modalElement =
          document.querySelector(".modal.show");

        if (modalElement) {
          Modal.getInstance(
            modalElement as Element,
          )?.hide();
        }

        resetModal();
      } catch (error: unknown) {
        console.error("Skiving Approval Error:", error);

        alert(
          getSkivingApprovalErrorMessage(
            error,
            "Failed to approve Skiving Approval.",
          ),
        );
      }
    }

  /* =====================
      REJECT
  ====================== */

  const handleReject =
    async () => {
      try {
        if (
          !selectedItem
        )
          return;

        if (
          !rejectionReason
        ) {
          alert(
            "Please Select Rejection Reason",
          );

          return;
        }

        const payload =
        {
          orderCasingIds:
            [
              selectedItem.id,
            ],

          isApproved:
            false,

          isRepeatSkiving:
            repeatSkiving,

          rejectionReasonId:
            rejectionReason,

          skipRepair:
            skipRepair,
        };

        await skivingStageServiceApi.saveSkivingApproval(
          payload,
        );

        alert(
          "Rejected Successfully",
        );

        refreshTable();
        const modalElement =
          document.querySelector(".modal.show");

        if (modalElement) {
          Modal.getInstance(
            modalElement as Element,
          )?.hide();
        }

        resetModal();
      } catch (error: unknown) {
        console.error("Skiving Rejection Error:", error);

        alert(
          getSkivingApprovalErrorMessage(
            error,
            "Failed to reject Skiving Approval.",
          ),
        );
      }
    };

  return {
    repeatSkiving,
    setRepeatSkiving,

    skipRepair,
    setSkipRepair,

    rejectionReason,
    setRejectionReason,

    rejectionReasons,

    handleApprove,

    handleReject,

    resetModal,
  };
};

export default useSkivingApprovalModal;