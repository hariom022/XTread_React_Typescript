import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useTreadBenchInspectionModal = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [loadingModal, setLoadingModal] = useState(false);

  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res = await indexPageApiService.getOrderCasingDetails(item.id);

      const casing = res.data;

      const modalData = {
        ...item,

        productionNumber: casing.productionNumber || "-",

        serial: casing.tyreReferenceNumber || "-",

        pattern: casing.retreadDetail?.patternName || casing.patternName || "-",

        tyreSize: casing.tyreSize?.casingSize || "-",

        service: casing.serviceType?.name || "-",
        width: casing.retreadDetail?.width || "-",
        brand: casing.retreadDetail?.brand || "-",
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
