import { useEffect, useMemo, useState } from "react";
import nailInspectionService from "../service/nailInspectionService";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import { NAIL_VISUAL_CHECKLIST } from "../constants/nailCheckList";

export const useNailInspection = () => {
  const [loading, setLoading] = useState(false);
  // Search
  const [search, setSearch] = useState("");

  // Data
  const [inspectionsData, setInspectionsData] = useState<any[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Checklist
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Repairs
  const [repairs, setRepairs] = useState<any[]>([]);

  const [newRepair, setNewRepair] = useState({
    location: "",
    type: "",
  });

  // Approval / Rejection
const [patchesRemoved, setPatchesRemoved] = useState<number>(0);
const [puncturesFound, setPuncturesFound] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal
  const [showChecklist, setShowChecklist] = useState(false);

  // ================= LOAD DATA =================

  const loadRejectionReasons = async () => {
    try {
      const response =
        await nailInspectionService.getRejectionReason();

      setRejectionReasons(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // const transformApiData = (orders: any[]) => {
  //   const list: any[] = [];

  //   orders.forEach((order) => {
  //     order.casings
  //       ?.filter(
  //         (casing: any) =>
  //           casing.currentStage === 4 &&
  //           casing.currentStageStatus === 1
  //       )
  //       .forEach((casing: any) => {
  //         list.push({
  //           id: casing.orderCasingId,

  //           casing:
  //             casing.productionNumber ||
  //             casing.barcodeNumber ||
  //             "-",

  //           date: order.createdAtUtc
  //             ? new Date(order.createdAtUtc)
  //                 .toISOString()
  //                 .split("T")[0]
  //             : "-",

  //           serial:
  //             casing.tyreReferenceNumber || "-",

  //           dot: casing.dotNumber || "-",

  //           pattern:
  //             casing.retreadDetail?.patternName ||
  //             "-",

  //           tyreSize:
  //             casing.tyreSize?.casingSize || "-",

  //           customerName:
  //             order.customer?.customerName || "-",

  //           service:
  //             casing.serviceType?.name || "-",

  //           batchNo:
  //             casing.batchNumber || "-",

  //           currentStage:
  //             casing.currentStage,

  //           currentStageStatus:
  //             casing.currentStageStatus,
  //         });
  //       });
  //   });

  //   return list;
  // };
const transformApiData = (stages: any[]) => {
  const transformed: any[] = [];

  (stages || []).forEach((stage: any) => {
    stage.batches?.forEach((batch: any) => {
      batch.casings?.forEach((casing: any) => {
        transformed.push({
          id: casing.orderCasingId,

          casing:
            casing.productionNumber ||
            casing.barcodeNumber ||
            "-",

          date:
            casing.orderDate || "-",

          serial:
            casing.tyreReferenceNumber || "-",

          dot:
            casing.dotNumber || "-",

          pattern:
            casing.patternName || "-",

          tyreSize:
            casing.tyreSizeLabel || "-",

          customerName:
            casing.customerName || "-",

          service:
            batch.batchNumber?.startsWith("RT")
              ? "Retread"
              : "Repair",

          batchNo:
            batch.batchNumber || "-",

          currentStageStatus:
            casing.currentStageStatus,

          // modal data
          requestedPattern:
            casing.patternName || "-",

          isRetreaded: false,

          previousPattern: "",

          previousRetreader: "",

          noOfRetread: 0,

          noOfExistingRepairs: 0,

          originalBatch: batch,

          originalCasing: casing,

          // batch summary
          approved:
            batch.stageSummary?.approved || 0,

          rejected:
            batch.stageSummary?.rejected || 0,

          pending:
            batch.stageSummary?.pending || 0,

          previousStage:
            batch.stageSummary
              ?.stillAtPreviousStage || 0,

          expectedTotal:
            batch.stageSummary
              ?.expectedTotal ||
            batch.originalBatchSize,

          arrived:
            batch.stageSummary?.arrived || 0,
        });
      });
    });
  });

  return transformed;
};
  // const loadOrders = async () => {
  //   try {
  //     const result =
  //       await indexPageApiService.getIndexPageOrders(
  //         4,
  //         1
  //       );

  //     const transformed = transformApiData(
  //       result.data.data
  //     );

  //     setInspectionsData(transformed);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const loadOrders = async () => {
  try {
    setLoading(true);

    const result =
      await indexPageApiService.getBatchProgress(
        4,
        1
      );

    console.log("API Result:", result);

    const transformed = transformApiData(
      result.data.data
    );

    console.log("Transformed:", transformed);

    setInspectionsData(transformed);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadOrders();
    loadRejectionReasons();
  }, []);

  // ================= FILTER =================

  const filteredInspections = useMemo(() => {
    return inspectionsData.filter((item) =>
      `${item.casing} ${item.serial} ${item.pattern}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, inspectionsData]);

  // ================= CHECKLIST =================

  const totalChecklistItems =
    NAIL_VISUAL_CHECKLIST.left.length +
    NAIL_VISUAL_CHECKLIST.right.length;

  const allChecklistIds = [
    ...NAIL_VISUAL_CHECKLIST.left.map((x) => x.id),
    ...NAIL_VISUAL_CHECKLIST.right.map((x) => x.id),
  ];

  const isChecklistComplete =
    checkedItems.length === totalChecklistItems;

  const isAllSelected =
    checkedItems.length === allChecklistIds.length;

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAllChecklist = () => {
    if (isAllSelected) {
      setCheckedItems([]);
    } else {
      setCheckedItems(allChecklistIds);
    }
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    setShowChecklist(false);
  };

  // ================= REPAIRS =================

  const addRepair = () => {
    if (
      !newRepair.location ||
      !newRepair.type
    ) {
      alert("Please select Location and Type");
      return;
    }

    setRepairs((prev) => [
      ...prev,
      newRepair,
    ]);

    setNewRepair({
      location: "",
      type: "",
    });
  };

  const clearRepairs = () => {
    setRepairs([]);
  };

  // ================= ACTIONS =================

  const openInspection = (item: any) => {
    setSelectedItem(item);

    resetChecklist();
    clearRepairs();

    setPatchesRemoved(0);
    setPuncturesFound(0);
    setRejectionReason("");
  };

  return {
    // Search
    search,
    setSearch,

    // Data
    inspectionsData,
    filteredInspections,
    rejectionReasons,
    selectedItem,
    setSelectedItem,

    // Loaders
    loadOrders,
    loading,

    // Checklist
    checkedItems,
    toggleChecklist,
    selectAllChecklist,
    isChecklistComplete,
    isAllSelected,
    showChecklist,
    setShowChecklist,

    // Repairs
    repairs,
    setRepairs,
    newRepair,
    setNewRepair,
    addRepair,
    clearRepairs,

    // Approval
    patchesRemoved,
    setPatchesRemoved,
    puncturesFound,
    setPuncturesFound,
    rejectionReason,
    setRejectionReason,

    // Actions
    openInspection,
    resetChecklist,
  };
};