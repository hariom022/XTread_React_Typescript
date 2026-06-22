import { useEffect, useState } from "react";
import buffingStageServiceApi from "../service/buffingStageServiceApi";
import { POST_BUFFING_CHECKLIST } from "../constants/postBuffingCheckList";

interface SelectedItem {
  id: number;
  treadPatternId?: number;
}

interface RejectionReason {
  rejectionReasonId: number;
  code: string;
  reason: string;
}

interface Machine {
  machineId: number;
  machineName: string;
}

interface DamageLevel {
  damageLevelId: number;
  name: string;
}

interface PatternVariant {
  treadPatternVariantId: number;
  width: string;
}

interface Props {
  selectedItem: SelectedItem | null;

  refreshTable: () => void;

  onClose: () => void;
}

const usePostBuffingApproveModal = ({ selectedItem, refreshTable, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [postRejectReason, setPostRejectReason] = useState("");

  const [machines, setMachines] = useState<Machine[]>([]);

  const [damageLevels, setDamageLevels] = useState<DamageLevel[]>([]);

  const [patternVariants, setPatternVariants] = useState<PatternVariant[]>([]);

  const [machineId, setMachineId] = useState<number | "">("");

  const [damageLevelId, setDamageLevelId] = useState<number | "">("");

  const [selectedPostVariantId, setSelectedPostVariantId] = useState<
    number | ""
  >("");

  const [circumference, setCircumference] = useState("");

  const [override, setOverride] = useState(false);

  const [postChecklistSaved, setPostChecklistSaved] = useState(false);

  const [postBuffingReasons, setPostBuffingReasons] = useState<
    RejectionReason[]
  >([]);

  const [showPostChecklist, setShowPostChecklist] = useState(false);

  const [checkedPostChecklist, setCheckedPostChecklist] = useState<string[]>(
    [],
  );

  const togglePostChecklist = (id: string) => {
    setCheckedPostChecklist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allPostChecklistIds = POST_BUFFING_CHECKLIST.map((x) => x.id);

  const selectAllPostChecklist =
    checkedPostChecklist.length === allPostChecklistIds.length;

  const handleSelectAllPostChecklist = () => {
    if (selectAllPostChecklist) {
      setCheckedPostChecklist([]);
    } else {
      setCheckedPostChecklist(allPostChecklistIds);
    }
  };

  const isPostChecklistComplete =
    checkedPostChecklist.length === POST_BUFFING_CHECKLIST.length;

  const resetModal = () => {
    setPostRejectReason("");

    setMachineId("");

    setDamageLevelId("");

    setSelectedPostVariantId("");

    setCircumference("");

    setOverride(false);

    setPatternVariants([]);

    setPostChecklistSaved(false);

    setShowPostChecklist(false);

    setCheckedPostChecklist([]);
  };

  /* ===========================
        REJECTION REASONS
    ============================ */

  const fetchPostBuffingRejectionReasons = async () => {
    try {
      const response =
        await buffingStageServiceApi.getPostBuffingRejectionReason();

      setPostBuffingReasons(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
        MACHINES
    ============================ */

  const fetchMachines = async () => {
    try {
      const response = await buffingStageServiceApi.getMachines();

      setMachines(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
        DAMAGE LEVELS
    ============================ */

  const fetchDamageLevels = async () => {
    try {
      const response = await buffingStageServiceApi.getDamageLevels();

      setDamageLevels(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
        PATTERN VARIANTS
    ============================ */

  const fetchPatternVariants = async (treadPatternId: number) => {
    try {
      const response =
        await buffingStageServiceApi.getPatternVariants(treadPatternId);

      const variants = response.data?.data?.[0]?.variants || [];

      setPatternVariants(variants);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchDamageLevels();
    fetchPostBuffingRejectionReasons();
  }, []);

  /* ===========================
        APPROVE
    ============================ */

  const handleApprove = async () => {
    try {
      setLoading(true);
      if (!selectedItem) return;

      if (!postChecklistSaved) {
        alert(
          "Please complete all Post Buffing checklist items before Approval",
        );
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id],

        isApproved: true,

        machineId: machineId || null,

        suggestedTreadPatternVariantId: selectedPostVariantId || null,

        circumference: circumference === "" ? null : Number(circumference),

        damageLevelId: damageLevelId || null,

        skipCircumferenceValidation: override,

        rejectionReasonCode: null,
      };

      await buffingStageServiceApi.approveRejectPostBuffing(payload);

      alert("Approved Successfully");

      refreshTable();

      resetModal();
      onClose();
    } catch (error: any) {
  console.error(error);

  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Approval Failed";

  alert(message);
} finally {
      setLoading(false);
    }
  };

  /* ===========================
        REJECT
    ============================ */

  const handleReject = async () => {
    try {
      setLoading(true);
      if (!selectedItem) return;

      if (!postChecklistSaved) {
        alert(
          "Please complete all Post Buffing checklist items before Rejection",
        );
        return;
      }

      if (!postRejectReason) {
        alert("Please select rejection reason");
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id],

        isApproved: false,

        machineId: machineId || null,

        suggestedTreadPatternVariantId: selectedPostVariantId || null,

        circumference: circumference === "" ? null : Number(circumference),

        damageLevelId: damageLevelId || null,

        skipCircumferenceValidation: override,

        rejectionReasonCode: postRejectReason,
      };

      await buffingStageServiceApi.approveRejectPostBuffing(payload);

      alert("Rejected Successfully");

      refreshTable();

      resetModal();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Reject Failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    machines,
    damageLevels,
    patternVariants,
    postBuffingReasons,

    machineId,
    setMachineId,

    damageLevelId,
    setDamageLevelId,

    selectedPostVariantId,
    setSelectedPostVariantId,

    circumference,
    setCircumference,

    override,
    setOverride,

    postRejectReason,
    setPostRejectReason,

    postChecklistSaved,
    setPostChecklistSaved,

    fetchPatternVariants,

    handleApprove,
    handleReject,

    resetModal,

    showPostChecklist,
    setShowPostChecklist,

    checkedPostChecklist,
    togglePostChecklist,

    selectAllPostChecklist,
    handleSelectAllPostChecklist,

    isPostChecklistComplete,
  };
};

export default usePostBuffingApproveModal;
