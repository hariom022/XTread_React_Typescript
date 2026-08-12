import { useEffect, useState } from "react";
import buffingStageServiceApi from "../service/buffingStageServiceApi";
import { PRE_BUFFING_CHECKLIST } from "../constants/preBuffingCheckList";

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
  onClose:()=>void;
}

const usePreBuffingApproveModal = ({ selectedItem, refreshTable, refreshPostTable,onClose }: Props) => {
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
      refreshPostTable(),
      resetModal();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Reject Failed");
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
      refreshPostTable(),
      resetModal();
      onClose();
     
    } catch (error) {
      console.error(error);

      alert("Approve Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHold = async () => {
    // try {
    //   setLoading(true);
    //   if (!selectedItem) return;

    //   if (!checklistSaved) {
    //     alert("Please complete all checklist items");
    //     return;
    //   }

    //   if (!holdReason) {
    //     alert("Please select hold reason");
    //     return;
    //   }

    //   if (!selectedVariantId) {
    //     alert("Please select width");
    //     return;
    //   }

    //   const payload = {
    //     orderCasingIds: [selectedItem.id],

    //     action: 3,

    //     reasonCode: holdReason,

    //     suggestedTreadPatternVariantId: selectedVariantId,
    //   };

    //   await buffingStageServiceApi.approveRejectPreBuffing(payload);

    //   alert("Hold Successfully");

    //   refreshTable();

    //   resetModal();
    // } catch (error) {
    //   console.error(error);

    //   alert("Hold Failed");
    // } finally {
    //   setLoading(false);
    // }
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
    loading
  };
};

export default usePreBuffingApproveModal;
