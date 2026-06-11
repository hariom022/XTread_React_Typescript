import { useEffect, useState } from "react";

import skivingStageServiceApi from "../service/skivingStageServiceApi";

import type{
  RejectionReason,
  skivingApprovalRow,
  SaveSkivingApprovalPayload,
} from "../types/skivingApproval.types";

export const useSkivingApprovalModal = (
  reloadGrid: () => void
) => {
  const [
    selectedApprovalItem,
    setSelectedApprovalItem,
  ] = useState<skivingApprovalRow | null>(
    null
  );

  const [repeatSkiving, setRepeatSkiving] =
    useState<boolean>(false);

  const [skipRepair, setSkipRepair] =
    useState<boolean>(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState<string>("");

  const [
    rejectionReasons,
    setRejectionReasons,
  ] = useState<RejectionReason[]>([]);

  const openModal = (
    item: skivingApprovalRow
  ) => {
    setSelectedApprovalItem(item);
  };

  const loadRejectionReasons =
    async (): Promise<void> => {
      try {
        const response =
          await skivingStageServiceApi.getSkivingRejectionReasons();

        setRejectionReasons(
          response.data?.data || []
        );
      } catch (error) {
        console.error(
          "Rejection Reasons Error",
          error
        );
      }
    };

  useEffect(() => {
    loadRejectionReasons();
  }, []);

  const hasRepairs =
    (selectedApprovalItem?.repairOperations
      ?.length ?? 0) > 0;

  useEffect(() => {
    if (hasRepairs) {
      setSkipRepair(false);
    }
  }, [selectedApprovalItem, hasRepairs]);

  const resetForm = () => {
    setSelectedApprovalItem(null);

    setRepeatSkiving(false);

    setSkipRepair(false);

    setRejectionReason("");
  };

  const handleApprove =
    async (): Promise<boolean> => {
      if (!selectedApprovalItem)
        return false;

      if (!repeatSkiving) {
        const confirmed =
          window.confirm(
            "This casing will proceed to the next stage.\n\nDo you want to continue without Repeat Skiving?"
          );

        if (!confirmed)
          return false;
      }

      try {
        const payload: SaveSkivingApprovalPayload =
          {
            orderCasingIds: [
              selectedApprovalItem.id,
            ],

            isApproved: true,

            isRepeatSkiving:
              repeatSkiving,

            rejectionReasonCode:
              null,

            skipRepair,
          };

        await skivingStageServiceApi.saveSkivingApproval(
          payload
        );

        alert(
          "Skiving Approval completed successfully"
        );

        reloadGrid();

        resetForm();

        return true;
      } catch (error) {
        console.error(error);

        alert(
          "Failed to approve casing"
        );

        return false;
      }
    };

  const handleReject =
    async (): Promise<boolean> => {
      if (!selectedApprovalItem)
        return false;

      if (!rejectionReason) {
        alert(
          "Please select Rejection Reason"
        );

        return false;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to reject this casing?"
        );

      if (!confirmed)
        return false;

      try {
        const payload: SaveSkivingApprovalPayload =
          {
            orderCasingIds: [
              selectedApprovalItem.id,
            ],

            isApproved: false,

            isRepeatSkiving:
              repeatSkiving,

            rejectionReasonCode:
              rejectionReason,

            skipRepair,
          };

        await skivingStageServiceApi.saveSkivingApproval(
          payload
        );

        alert(
          "Casing rejected successfully"
        );

        reloadGrid();

        resetForm();

        return true;
      } catch (error) {
        console.error(error);

        alert(
          "Failed to reject casing"
        );

        return false;
      }
    };

  return {
    selectedApprovalItem,

    openModal,

    repeatSkiving,
    setRepeatSkiving,

    skipRepair,
    setSkipRepair,

    rejectionReason,
    setRejectionReason,

    rejectionReasons,

    hasRepairs,

    resetForm,

    handleApprove,

    handleReject,
  };
};