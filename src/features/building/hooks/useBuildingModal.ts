import { useEffect, useState } from "react";

import buildingServiceApi from "../service/buildingServiceApi";

interface Props {
  selectedItem: any;
  onClose: () => void;
  refreshTable: () => void;
}

const useBuildingModal = ({ selectedItem, onClose, refreshTable }: Props) => {
  const [selectedPattern, setSelectedPattern] = useState("");

  const [selectedWidth, setSelectedWidth] = useState("");

  const [widthOptions, setWidthOptions] = useState<number[]>([]);

  // ==========================
  // LOAD WIDTHS
  // ==========================

  const loadWidths = async () => {
    try {
      if (!selectedItem?.treadPatternId) return;

      const response = await buildingServiceApi.getWidth(
        selectedItem.treadPatternId,
      );

      const widths =
        response.data.data?.[0]?.variants?.map((item: any) => item.width) || [];

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

      const isRetread = selectedItem?.serviceType?.id === 1;

      if (isRetread && !selectedWidth) {
        alert("Please select Width");
        return;
      }
      const payload = {
        orderCasingIds: [String(selectedItem.id)],

        isApproved: true,

        width: isRetread ? Number(selectedWidth) : null,

        rejectionReasonCode: null,
      };
      console.log("HANDLE APPROVED PAYLOAD:=->", selectedItem);
      console.log("Building Payload", payload);
      await buildingServiceApi.approveReject(payload);

      alert("Approved Successfully");

      refreshTable();

      resetModal();

      onClose();
    } catch (error: any) {
      console.error("FULL ERROR", error);
      console.error("RESPONSE", error?.response);
      console.error("DATA", error?.response?.data);
      console.error("STATUS", error?.response?.status);

      alert(JSON.stringify(error?.response?.data));
    }
  };

  const handleReturnToRepair = async () => {
    try {
      if (!selectedItem) return;

      const payload = {
        orderCasingIds: [
          Number(selectedItem.orderCasingId ?? selectedItem.id),
        ],
      };

      console.log("RETURN TO REPAIR PAYLOAD", payload);

      await buildingServiceApi.sendToRepair(payload);

      alert("Returned To Repair Successfully");

      refreshTable();

      resetModal();

      onClose();
    } catch (error: any) {
      console.error("FULL ERROR", error);
      console.error("RESPONSE", error?.response);
      console.error("DATA", error?.response?.data);

      alert(
        error?.response?.data ||
        "Return To Repair Failed"
      );
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setSelectedPattern(selectedItem.requestedPattern || "");

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
