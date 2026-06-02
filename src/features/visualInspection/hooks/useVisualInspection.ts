import { useEffect, useState } from "react";

import visualInspectionService from "../service/visualInspectionService";
import indexPageApiService from "../../../shared/services/indexPageApiService";
export const useVisualInspection = () => {
  const [loading, setLoading] = useState(false);

  const [inspections, setInspections] = useState<any[]>([]);

  const [rejectionReasons, setRejectionReasons] =
    useState([]);

  const loadVisualInspection = async () => {
    try {
      setLoading(true);

     const res =
  await indexPageApiService.getIndexPageOrders(3,1);

console.log("VISUAL API", res.data);

const transformed: any[] = [];

(res.data?.data || []).forEach((order: any) => {

  order.casings
    ?.filter(
      (casing: any) =>
        casing.currentStage === 3 &&
        casing.currentStageStatus === 1
    )
    .forEach((casing: any) => {

    transformed.push({
      id: casing.orderCasingId,

      casing:
        casing.productionNumber ||
        casing.tyreReferenceNumber ||
        "-",

      date:
        order.createdAtUtc?.split("T")[0] || "-",

      serial:
        casing.tyreReferenceNumber || "-",

      dot:
        casing.dotNumber || "-",

      pattern:
        casing.retreadDetail?.patternName || "-",

      requestedPattern:
        casing.retreadDetail?.patternName || "-",

      tyreSize:
        casing.tyreSize?.casingSize || "-",

      customerName:
        order.customer?.customerName || "-",

      service:
        casing.serviceType?.name || "-",

      batchNo:
        casing.batchNumber || "-",

      isRetreaded:
        casing.isRetreaded || false,

      previousPattern:
        casing.previousPattern || "-",

      previousRetreader:
        casing.previousRetreader || "-",

      noOfRetread:
        casing.noOfRetread || 0,

      noOfExistingRepairs:
        casing.existingRepairsCount || 0,

      tyresPerBatch: 0,

      qtyAtStation: 0,

      collectorZone: "",

      originalOrder: order,
      originalCasing: casing,
    });

  });

});

console.log(
  "TRANSFORMED VISUAL",
  transformed
);

setInspections(transformed);
    } finally {
      setLoading(false);
    }
  };

  const loadRejectionReasons = async () => {
    const res =
      await visualInspectionService.getRejectionReason();

    setRejectionReasons(res.data.data);
  };

  useEffect(() => {
    loadVisualInspection();
    loadRejectionReasons();
  }, []);

  return {
    loading,

    inspections,

    rejectionReasons,

    loadVisualInspection,
  };
};