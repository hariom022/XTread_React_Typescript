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

  // const [rubberList, setRubberList] = useState<Materials[]>([]);

  const [cushionGumList, setCushionGumList] = useState<Materials[]>([]);
  const [shutterProofGumList, setShutterProofGumList] = useState<Materials[]>([]);

  // const fetchRubbers = async () => {
  //   try {
  //     const prodHierarchy4 = "000060000800001005";
  //     setProcessing(true);

  //     var res = await buildingServiceApi.getRubber(prodHierarchy4);
  //     setRubberList(res.data.data);
  //   } catch (err) {
  //     throw err;
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

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

  const fetchShutterProofGum = async () => {
    try {
      setProcessing(true);

      const res =
        await buildingServiceApi.getShutterProofGum();

      setShutterProofGumList(res.data.data);
    } catch (err) {
      throw err;
    } finally {
      setProcessing(false);
    }
  };
  useEffect(() => {
    // fetchRubbers();
    fetchCushionGum();
    fetchShutterProofGum();
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
    selectedCushionGum: string,
    selectedShutterProofGum: string,
  ) => {
    try {
      setProcessing(true);

      if (!selectedItem) return;

      const isRetread = selectedItem?.service === "Retread";

      if (isRetread && !selectedWidth) {
        alert("Please select Width");
        return;
      }

      const payload = {
        orderCasingIds: [String(selectedItem.id)],

        isApproved: true,

        width: isRetread ? selectedWidth : "-0",

        treadPatternVariantId: String(
          selectedItem.treadPatternVariantId || ""
        ),

        rejectionReasonId: "-0",

        materialConsumptions: null,

        finishedMaterial: "71000210",

        overrideShutterproof:
          selectedShutterProofGum === "70000056",

        cushionGum: {
          rawMaterial: selectedCushionGum,
        },

        shutterProofGum: {
          rawMaterial: selectedShutterProofGum,
        },
      };

      console.log("BUILDING APPROVE PAYLOAD", payload);

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
    // rubberList,
    cushionGumList,
    shutterProofGumList,
  };
};

export default useBuildingModal;
