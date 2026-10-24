import { useEffect, useState } from "react";
import buffingStageServiceApi from "../service/buffingStageServiceApi";
import { PRE_BUFFING_CHECKLIST } from "../constants/preBuffingCheckList";
import { getPreBuffingErrorMessage } from "../utils/preBuffingErrorHandler";

interface Variant {
  treadPatternVariantId: number;
  width: string;
}

interface Pattern {
  treadPatternId: number;
  patternName: string;
  brand: string;
  variants: Variant[];
}

interface Reason {
  rejectionReasonId: number;
  code: string;
  reason: string;
}

interface SelectedItem {
  id: number;
}

interface Props {
  selectedItem: SelectedItem | null;
  refreshTable: () => void;
  refreshPostTable: () => Promise<void>;
  onClose: () => void;
}

const usePreBuffingApproveModal = ({
  selectedItem,
  refreshTable,
  refreshPostTable,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState("");
  const [holdReason, setHoldReason] = useState("");

  const [rejectionReasons, setRejectionReasons] = useState<Reason[]>([]);

  const [holdReasons, setHoldReasons] = useState<Reason[]>([]);

  const [patterns, setPatterns] = useState<Pattern[]>([]);

  const [selectedPatternId, setSelectedPatternId] = useState("");

  const [selectedVariantId, setSelectedVariantId] = useState<number | "">("");

  const [selectedWidth, setSelectedWidth] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");

  const [checklistSaved, setChecklistSaved] = useState(false);

  const [showChecklist, setShowChecklist] = useState(false);

  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);

  const [isValidatingMaterial, setIsValidatingMaterial] = useState(false);

  const [isFinishedMaterialValid, setIsFinishedMaterialValid] = useState<
    boolean | null
  >(null);

  const [materialValidationMessage, setMaterialValidationMessage] =
    useState("");

  const toggleChecklist = (id: string) => {
    setCheckedChecklist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const allChecklistIds = PRE_BUFFING_CHECKLIST.map((x) => x.id);

  const selectAllChecklist = checkedChecklist.length === allChecklistIds.length;

  const handleSelectAllChecklist = () => {
    if (selectAllChecklist) {
      setCheckedChecklist([]);
    } else {
      setCheckedChecklist(allChecklistIds);
    }
  };
  const isChecklistComplete =
    checkedChecklist.length === PRE_BUFFING_CHECKLIST.length;

  const resetModal = () => {
    setReason("");
    setHoldReason("");

    setPatterns([]);

    setSelectedPatternId("");
    setSelectedVariantId("");

    setSelectedWidth("");
    setSelectedBrand("");

    setChecklistSaved(false);

    setShowChecklist(false);

    setCheckedChecklist([]);
    setIsValidatingMaterial(false);
    setIsFinishedMaterialValid(null);
    setMaterialValidationMessage("");
  };

  const fetchRejectionReasons = async () => {
    try {
      const response =
        await buffingStageServiceApi.getPreBuffingRejectionReason();

      setRejectionReasons(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHoldReasons = async () => {
    try {
      const response = await buffingStageServiceApi.getPreBuffingHoldReason();

      setHoldReasons(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestedPatterns = async (orderCasingId: number) => {
    try {
      const response =
        await buffingStageServiceApi.getSuggestedPatterns(orderCasingId);

      setPatterns(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRejectionReasons();
    fetchHoldReasons();
  }, []);

  const handleReject = async () => {
    try {
      setLoading(true);

      if (!selectedItem) return;

      if (!checklistSaved) {
        alert("Please complete all checklist items");
        return;
      }

      if (!reason) {
        alert("Please select rejection reason");
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id],
        action: 4,
        rejectionReasonId: reason,
        suggestedTreadPatternVariantId: null,
      };

      await buffingStageServiceApi.approveRejectPreBuffing(payload);

      alert("Casing Rejected Successfully");

      refreshTable();
      (refreshPostTable(), resetModal());
      onClose();
    } catch (error: unknown) {
      console.error("Pre-Buffing Reject Error:", error);

      alert(
        getPreBuffingErrorMessage(
          error,
          "Unable to reject the casing. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      if (!selectedItem) return;

      if (!checklistSaved) {
        alert("Please complete all checklist items");
        return;
      }

      const hasSuggestion =
        holdReason ||
        selectedPatternId ||
        selectedVariantId ||
        selectedBrand ||
        selectedWidth;

      if (hasSuggestion) {
        alert("Suggested Pattern Exists. Use HOLD.");

        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id],
        action: 2,
        reasonCode: null,
        suggestedTreadPatternVariantId: null,
      };

      await buffingStageServiceApi.approveRejectPreBuffing(payload);

      alert("Approved Successfully");

      refreshTable();
      (refreshPostTable(), resetModal());
      onClose();
    } catch (error: unknown) {
      console.error("Pre-Buffing Approve Error:", error);

      alert(
        getPreBuffingErrorMessage(
          error,
          "Unable to approve the casing. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHold = async () => {
    try {
      setLoading(true);

      if (!selectedItem) return;

      if (!checklistSaved) {
        alert("Please complete all checklist items");
        return;
      }

      // Validate required fields for the new HOLD API
      if (!holdReason) {
        alert("Please select Hold Reason");
        return;
      }

      if (!selectedPatternId) {
        alert("Please select Pattern");
        return;
      }

      if (!selectedVariantId) {
        alert("Please select Width");
        return;
      }

      const payload = {
        orderCasingId: selectedItem.id,
        rejectionReasonId: Number(holdReason),
        treadPatternId: Number(selectedPatternId),
        treadPatternVariantId: Number(selectedVariantId),
        remarks: "", // You can modify this if you want to include remarks
      };

      console.log("Pre-Buffing HOLD Payload:", payload);

      const response = await buffingStageServiceApi.createHold(payload);

      console.log("Pre-Buffing HOLD Response:", response.data);

      if (response.data?.success) {
        alert("Hold Successfully");

        refreshTable();
        await refreshPostTable();

        resetModal();
        onClose();
      } else {
        alert(response.data?.error || "Hold Failed");
      }
    } catch (error: unknown) {
      console.error("Pre-Buffing HOLD Error:", error);

      alert(
        getPreBuffingErrorMessage(
          error,
          "Unable to put the casing on hold. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

 const checkFinishedMaterial = async (
  tyreSize: string,
  patternName: string,
) => {
  if (!tyreSize || !patternName) {
    setIsFinishedMaterialValid(null);
    setMaterialValidationMessage("");
    return;
  }

  try {
    setIsValidatingMaterial(true);
    setIsFinishedMaterialValid(null);
    setMaterialValidationMessage("");

    const response =
      await buffingStageServiceApi.validateFinishedMaterial(
        tyreSize,
        patternName,
      );

    const result = response.data;

    console.log("Finished Material Response:", result);

    // API success response: { success: true, data: true, error: null }
    if (result?.success === true && result?.data === true) {
      setIsFinishedMaterialValid(true);
      setMaterialValidationMessage(
        "Finished material validated successfully.",
      );
    } else {
      setIsFinishedMaterialValid(false);
      setMaterialValidationMessage(
        `No finished material (ZFER) found for tyre size ${tyreSize} and pattern ${patternName}.`,
      );
    }
  } catch (error: unknown) {
    console.error("Finished material validation failed:", error);

    // API failure response: HTTP 404 with error.message
    const apiMessage =
      (error as {
        response?: {
          data?: {
            error?: {
              message?: string;
            };
          };
        };
      })?.response?.data?.error?.message;

    setIsFinishedMaterialValid(false);
    setMaterialValidationMessage(
      apiMessage ||
        `No finished material (ZFER) found for tyre size ${tyreSize} and pattern ${patternName}.`,
    );
  } finally {
    setIsValidatingMaterial(false);
  }
};

  return {
    reason,
    setReason,

    holdReason,
    setHoldReason,

    rejectionReasons,

    holdReasons,

    patterns,

    selectedPatternId,
    setSelectedPatternId,

    selectedVariantId,
    setSelectedVariantId,

    selectedWidth,
    setSelectedWidth,

    selectedBrand,
    setSelectedBrand,

    checklistSaved,
    setChecklistSaved,

    fetchSuggestedPatterns,

    handleApprove,

    handleReject,

    handleHold,

    resetModal,

    showChecklist,
    setShowChecklist,

    checkedChecklist,
    toggleChecklist,

    selectAllChecklist,
    handleSelectAllChecklist,

    isChecklistComplete,
    loading,
    checkFinishedMaterial,
    isValidatingMaterial,
    isFinishedMaterialValid,
    materialValidationMessage,
  };
};

export default usePreBuffingApproveModal;
