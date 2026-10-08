import { useEffect, useState } from "react";

import buildingServiceApi from "../service/buildingServiceApi";
import { getBuildingErrorMessage } from "../utils/buildingErrorHandler";
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
      console.log("========== WIDTH DEBUG ==========");

      console.log("Selected Item:", selectedItem);
      console.log(
        "Tread Pattern ID:",
        selectedItem?.treadPatternId
      );
      console.log(
        "Tread Pattern Variant ID:",
        selectedItem?.treadPatternVariantId
      );
      console.log(
        "Original Width:",
        selectedItem?.width
      );

      if (!selectedItem?.treadPatternId) {
        console.log("❌ No treadPatternId");
        return;
      }

      const response = await buildingServiceApi.getWidth(
        selectedItem.treadPatternId
      );

      const variants =
        response.data.data?.[0]?.variants || [];

      const widths = variants.map(
        (item: any) => item.width
      );

      console.log("Available Widths:", widths);
      console.log(
        "Current API Width:",
        selectedItem.width
      );

      setWidthOptions(widths);

      // AUTO BIND EXISTING WIDTH
      if (selectedItem?.width !== null && selectedItem?.width !== undefined) {
        setSelectedWidth(String(selectedItem.width));

        console.log(
          "✅ AUTO BOUND WIDTH:",
          String(selectedItem.width)
        );
      }

    } catch (error) {
      console.error("❌ WIDTH API ERROR:", error);
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

      // Width is required for Retread
      if (isRetread && !selectedWidth) {
        alert("Please select Width.");
        return;
      }

      // Cushion Gum is required
      if (!selectedCushionGum) {
        alert("Please select Cushion Gum.");
        return;
      }

      // Shutter Proof Gum is required
      if (!selectedShutterProofGum) {
        alert("Please select Shutter Proof Gum.");
        return;
      }

      // Pattern Variant is required
      if (!selectedItem?.treadPatternVariantId) {
        alert(
          "Tread pattern variant information is not available for this order. Please refresh the order and try again."
        );
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
      console.error("BUILDING APPROVE ERROR:", error);
      console.error(
        "BUILDING APPROVE API RESPONSE:",
        error?.response?.data
      );

      const message = getBuildingErrorMessage(
        error,
        "Unable to approve the order. Please try again."
      );

      alert(message);
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
      console.error("BUILDING RETURN TO REPAIR ERROR:", error);
      console.error(
        "BUILDING RETURN TO REPAIR API RESPONSE:",
        error?.response?.data
      );

      const message = getBuildingErrorMessage(
        error,
        "Unable to return the order to repairs. Please try again."
      );

      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setSelectedPattern(selectedItem.requestedPattern || "");

      // setSelectedWidth("");

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
