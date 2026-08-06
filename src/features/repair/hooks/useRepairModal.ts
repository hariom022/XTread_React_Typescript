import { useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useRepairModal = () => {
  const [showModal, setShowModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res = await indexPageApiService.getOrderCasingDetails(item.id);

      console.log("NAIL CASING DETAILS", res.data.data);

      const casing = res.data.data;
      console.log("CASING DETAILS", casing);

      const modalData = {
        ...item,

        // From orders/casings/:orderCasingId API
        orderCasingId: casing.orderCasingId,
        productionNumber: casing.productionNumber,
        tyreReferenceNumber: casing.tyreReferenceNumber,
        customerName: casing.customerName,

        service: casing.serviceType?.name || "-",

        tyreSize: casing.tyreSize?.casingSize || "-",

        tyreMake: casing.tyreMake?.name || "-",

        model: casing.model || "-",

        requestedPattern: casing.retreadDetail?.patternName || "-",

        isRetreaded: casing.isRetreaded || false,

        previousPattern: casing.previousPattern || "-",

        previousRetreader: casing.previousRetreader || "-",

        noOfRetread: casing.noOfRetread || 0,

        noOfExistingRepairs: casing.existingRepairsCount || 0,

        repairDetail: [
          ...(casing.repairDetail?.operations || [])
            .filter(
              (operation: any) =>
                operation.casingStageId === 1 ||
                operation.casingStageId === 4 ||
                operation.casingStageId === 8,
            )
            .map((operation: any) => ({
              damageType: operation.repairType,

              repairLocation: operation.repairLocation,

              foundAt:
                operation.casingStageId === 1
                  ? "Collection"
                  : operation.casingStageId === 4
                    ? "Nail Inspection"
                    : "Skiving Stage",

              reasonForRemoval: "-",

              casingStageId: operation.casingStageId,
            })),

          ...(casing.removalOperations || [])
            .filter(
              (operation: any) =>
                operation.casingStageId === 1 ||
                operation.casingStageId === 4 ||
                operation.casingStageId === 8,
            )
            .map((operation: any) => ({
              damageType: "-",

              repairLocation: operation.repairLocation,

              foundAt:
                operation.casingStageId === 1
                  ? "Collection"
                  : operation.casingStageId === 4
                    ? "Nail Inspection"
                    : "Skiving Stage",

              reasonForRemoval: operation.reasonForRemoval || "-",

              casingStageId: operation.casingStageId,
            })),
        ],

        punctureCount: casing.punctureCount || 0,

        patchesRemoved: casing.patchesRemoved || 0,

        puncturesFound: casing.puncturesFound || 0,

        originalCasing: casing,
        reApprovedPattern:
          // casing.retreadDetail
          //   ?.patternName ||
          "-",
      };

      setSelectedItem(modalData);

      setShowModal(true);
    } catch (error) {
      console.error(error);

      alert("Failed to load casing details");
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);

    setSelectedItem(null);
  };

  return {
    showModal,

    loadingModal,

    selectedItem,

    openModal,

    closeModal,
  };
};
