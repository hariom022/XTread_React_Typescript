import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useCementingInspectionModal = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [loadingModal, setLoadingModal] = useState(false);


  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res = await indexPageApiService.getOrderCasingDetails(item.id);

      const casing = res.data.data;
      console.log("CEMENTING CASING DETAILS", casing);

      const modalData = {
        ...item,

        productionNumber:
          casing.productionNumber || "-",

        serial:
          casing.tyreReferenceNumber || "-",

        customerName:
          casing.customerName || "-",

        cementTypeId:
          casing.cementing?.cementTypeId ??
          casing.cementTypeId ??
          item.cementTypeId ??
          null,

        cementTypeSavedAtUtc:
          casing.cementing?.cementTypeSavedAtUtc ??
          casing.cementTypeSavedAtUtc ??
          item.cementTypeSavedAtUtc ??
          null,

        isCementTypeSaved:
          Boolean(casing.isCementTypeSaved) ||
          casing.cementing?.cementTypeId != null ||
          casing.cementTypeId != null ||
          item.cementTypeId != null ||
          Boolean(casing.cementing?.cementTypeSavedAtUtc) ||
          Boolean(casing.cementTypeSavedAtUtc) ||
          Boolean(item.cementTypeSavedAtUtc) ||
          Boolean(item.isCementTypeSaved),

        requestedPattern:
          casing.retreadDetail?.patternName || "-",

        pattern:
          casing.retreadDetail?.patternName || "-",

        tyreSize:
          casing.tyreSize?.casingSize || "-",

        service:
          casing.serviceType?.name || "-",

        skipRepair:
          casing.skipRepair || false,

        casingDry:
          casing.casingDry || false,

        reApprovedPattern: "-", // API not returning this field
      };

      setSelectedItem(modalData);
      setShowModal(true);
    } catch (error) {
      console.error(error);
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
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  };
};
