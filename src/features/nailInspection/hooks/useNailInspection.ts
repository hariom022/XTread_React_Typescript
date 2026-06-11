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

  const [resonForRemoval, setReasonForRemoval] = useState<any[]>([]);

  const [location, setLocation] = useState<any[]>([]);

  const [damageType, setDamageType] = useState<any[]>([]);
  // const [patchRemovals, setPatchRemovals] = useState<any[]>([]);

  // const [newPatchRemoval, setNewPatchRemoval] = useState({
  //   reasonForRemoval: "",
  //   location: "",
  // });
  const [patchRemovals, setPatchRemovals] = useState<any[]>([]);

  const [newPatchRemoval, setNewPatchRemoval] = useState({
    reasonForRemoval: "",
    location: "",
  });
  const loadLocation = async () => {
    try {
      const locationRes = await nailInspectionService.getLocation();
      setLocation(locationRes.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadReasonForRemoval = async () => {
    try {
      const removalRes = await nailInspectionService.getReasonForRemoval();
      setReasonForRemoval(removalRes.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadDamageType = async () => {
    try {
      const damaeTypeRes = await nailInspectionService.getDamageType();
      setDamageType(damaeTypeRes.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  // Approval / Rejection
  const [patchesRemoved, setPatchesRemoved] = useState<number>(0);
  const [puncturesFound, setPuncturesFound] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal
  const [showChecklist, setShowChecklist] = useState(false);

  // ================= LOAD DATA =================

  const loadRejectionReasons = async () => {
    try {
      const response = await nailInspectionService.getRejectionReason();

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
          console.log("CASING", casing);
          transformed.push({
            id: casing.orderCasingId,

            casing: casing.productionNumber || casing.barcodeNumber || "-",

            date: casing.orderDate || "-",

            serial: casing.tyreReferenceNumber || "-",

            dot: casing.dotNumber || "-",

            patternName: casing?.patternName || "-",

            tyreSize: casing.tyreSizeLabel || "-",

            customerName: casing.customerName || "-",

            service: batch.batchNumber?.startsWith("RT") ? "Retread" : "Repair",

            batchNo: batch.batchNumber || "-",

            currentStageStatus: casing.currentStageStatus,

            // modal data
            requestedPattern: casing.patternName || "-",

            isRetreaded: false,

            previousPattern: "",

            previousRetreader: "",

            noOfRetread: 0,

            noOfExistingRepairs: 0,

            originalBatch: batch,

            originalCasing: casing,

            // batch summary
            approved: batch.stageSummary?.approved || 0,

            rejected: batch.stageSummary?.rejected || 0,

            pending: batch.stageSummary?.pending || 0,

            previousStage: batch.stageSummary?.stillAtPreviousStage || 0,

            expectedTotal:
              batch.stageSummary?.expectedTotal || batch.originalBatchSize,

            arrived: batch.stageSummary?.arrived || 0,
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

      const result = await indexPageApiService.getBatchProgress(4, 1);

      console.log("API Result:", result);

      const transformed = transformApiData(result.data.data);

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
    loadLocation();
    loadReasonForRemoval();
    loadDamageType();
  }, []);

  // ================= FILTER =================

  const filteredInspections = useMemo(() => {
    return inspectionsData.filter((item) =>
      `${item.casing} ${item.serial} ${item.pattern}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, inspectionsData]);

  // ================= CHECKLIST =================

  const totalChecklistItems =
    NAIL_VISUAL_CHECKLIST.left.length + NAIL_VISUAL_CHECKLIST.right.length;

  const allChecklistIds = [
    ...NAIL_VISUAL_CHECKLIST.left.map((x) => x.id),
    ...NAIL_VISUAL_CHECKLIST.right.map((x) => x.id),
  ];

  const isChecklistComplete = checkedItems.length === totalChecklistItems;

  const isAllSelected = checkedItems.length === allChecklistIds.length;

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
    if (!newRepair.location || !newRepair.type) {
      alert("Please select Location and Type");
      return;
    }

    setRepairs((prev) => [...prev, newRepair]);

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

  const addRemove = () => {
    if (!newPatchRemoval.reasonForRemoval || !newPatchRemoval.location) {
      alert("Please select Reason For Removal and Location");
      return;
    }

    const selectedReason = resonForRemoval.find(
      (x: any) => x.id === Number(newPatchRemoval.reasonForRemoval),
    );

    const selectedLocation = location.find(
      (x: any) => x.id === Number(newPatchRemoval.location),
    );

    setPatchRemovals((prev) => [
      ...prev,
      {
        reasonForRemoval: selectedReason?.name || "",
        location: selectedLocation?.name || "",
      },
    ]);

    setNewPatchRemoval({
      reasonForRemoval: "",
      location: "",
    });
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

    resonForRemoval,
    setReasonForRemoval,
    location,
    setLocation,
    damageType,
    setDamageType,

    patchRemovals,
    setPatchRemovals,

    newPatchRemoval,
    setNewPatchRemoval,

    addRemove,
  };
};
