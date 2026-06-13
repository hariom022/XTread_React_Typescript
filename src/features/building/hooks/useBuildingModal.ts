import { useEffect, useState } from "react";

import buildingServiceApi from "../service/buildingServiceApi";

interface Props {
  selectedItem: any;
  onClose: () => void;
  refreshTable: () => void;
}

const useBuildingModal = ({
  selectedItem,
  onClose,
  refreshTable,
}: Props) => {
  const [selectedPattern, setSelectedPattern] =
    useState("");

  const [selectedWidth, setSelectedWidth] =
    useState("");

  const [widthOptions, setWidthOptions] =
    useState<number[]>([]);

  // ==========================
  // LOAD WIDTHS
  // ==========================

  const loadWidths = async () => {
    try {
      if (
        !selectedItem?.treadPatternId
      )
        return;

      const response =
        await buildingServiceApi.getWidth(
          selectedItem.treadPatternId,
        );

      const widths =
        response.data.data?.[0]
          ?.variants?.map(
            (item: any) =>
              item.width,
          ) || [];

      setWidthOptions(widths);
    } catch (error) {
      console.error(error);
    }
  };
  const resetModal = () => {
    setSelectedPattern("");

    setSelectedWidth("");

    setWidthOptions([]);
  };

  const handleApprove = async () => {
    try {
      if (!selectedItem) return;

      if (!selectedWidth) {
        alert("Please select width");
        return;
      }

      const payload = {
        orderCasingIds: [
          String(selectedItem.id),
        ],

        isApproved: true,

        width: selectedWidth,

        rejectionReasonCode: null,
      };

      await buildingServiceApi.approveReject(
        payload,
      );

      alert("Approved Successfully");

      refreshTable();

      resetModal();

      onClose();
    } catch (error) {
      console.error(error);

      alert("Approval Failed");
    }
  };

  const handleReturnToRepair =
    async () => {
      try {
        if (!selectedItem) return;

        if (!selectedWidth) {
          alert("Please select width");
          return;
        }

        const reason =
          prompt(
            "Enter Rejection Reason Code",
          );

        if (!reason) return;

        const payload = {
          orderCasingIds: [
            String(selectedItem.id),
          ],

          isApproved: false,

          width: selectedWidth,

          rejectionReasonCode:
            reason,
        };

        await buildingServiceApi.approveReject(
          payload,
        );

        alert(
          "Returned To Repair Successfully",
        );

        refreshTable();

        resetModal();

        onClose();
      } catch (error) {
        console.error(error);

        alert("Return To Repair Failed");
      }
    };
  useEffect(() => {
    if (selectedItem) {
      setSelectedPattern(
        selectedItem.requestedPattern ||
        "",
      );

      setSelectedWidth("");

      loadWidths();
    }
  }, [selectedItem]);

  return {
    selectedPattern,

    selectedWidth,
    setSelectedWidth,

    widthOptions,
    resetModal,
    handleApprove,
    handleReturnToRepair,
  };
};

export default useBuildingModal;