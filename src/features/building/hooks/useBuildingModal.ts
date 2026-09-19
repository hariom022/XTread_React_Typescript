import { useEffect, useState } from "react";

import buildingServiceApi from "../service/buildingServiceApi";
import type { Materials } from "../type/building.types";

interface Props {
  selectedItem: any;
  onClose: () => void;
  refreshTable: () => void;
}

const useBuildingModal = ({ selectedItem, onClose, refreshTable }: Props) => {
  const [selectedPattern, setSelectedPattern] = useState("");

  const [selectedWidth, setSelectedWidth] = useState("");

  const [widthOptions, setWidthOptions] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  const [rubberList, setRubberList] = useState<Materials[]>([]);

  const [cushionGumList, setCushionGumList] = useState<Materials[]>([]);

  const fetchRubbers = async () => {
    try {
      const prodHierarchy4 = "000060000800001005";
      setProcessing(true);

      var res = await buildingServiceApi.getRubber(prodHierarchy4);
      setRubberList(res.data.data);
    } catch (err) {
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const fetchCushionGum = async () => {
    try {
      const prodHierarchy4 = "000060000800001007";
      setProcessing(true);

      var res = await buildingServiceApi.getCushionGum(prodHierarchy4);
      setCushionGumList(res.data.data);
    } catch (err) {
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchRubbers();
    fetchCushionGum();
  }, []);
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

  const handleApprove = async (
    selectedRubber: string,
    selectedCushionGum: string,
  ) => {
    try {
      setProcessing(true);
      if (!selectedItem) return;

      // const isRetread = selectedItem?.serviceType?.id === 1;
      const isRetread = selectedItem?.service === "Retread";

      if (isRetread && !selectedWidth) {
        alert("Please select Width");
        return;
      }

      const materialConsumptions = [];

      if (selectedRubber) {
        materialConsumptions.push({
          prodHierarchy4: "000060000800001005",
          material: selectedRubber,
          consumptionType: 1,
        });
      }

      if (selectedCushionGum) {
        materialConsumptions.push({
          prodHierarchy4: "000060000800001007",
          material: selectedCushionGum,
          consumptionType: 1,
        });
      }

      const payload = {
        orderCasingIds: [Number(selectedItem.id)],

        isApproved: true,

        width: isRetread ? selectedWidth : null,

        rejectionReasonId: "-0",

        materialConsumptions,
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
    } finally {
      setProcessing(false);
    }
  };

  const handleReturnToRepair = async () => {
    try {
      setProcessing(true);
      if (!selectedItem) return;

      const payload = {
        orderCasingIds: [Number(selectedItem.orderCasingId ?? selectedItem.id)],
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

      alert(error?.response?.data || "Return To Repair Failed");
    } finally {
      setProcessing(false);
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
    processing,
    rubberList,
    cushionGumList,
  };
};

export default useBuildingModal;
