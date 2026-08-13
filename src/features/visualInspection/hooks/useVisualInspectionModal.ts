import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useVisualInspectionModal = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [loadingModal, setLoadingModal] = useState(false);

  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res = await indexPageApiService.getOrderCasingDetails(item.id);
      console.log("VISUAL INSPECT API", res.data);
      const casing = res.data.data;

      const modalData = {
        ...item,

        service: casing.serviceType?.name || "-",

        tyreSize: casing.tyreSize?.casingSize || "-",

        tyreMake: casing.tyreMake?.name || "-",

        model: casing.model || "-",

        requestedPattern: casing.retreadDetail?.patternName || "-",

        isRetreaded: casing.isRetreaded,

        previousPattern: casing.previousPattern,

        previousRetreader: casing.previousRetreader,

        noOfRetread: casing.noOfRetread,

        noOfExistingRepairs: casing.existingRepairsCount,

        repairDetail: casing.repairDetail,
      };

      setSelectedItem(modalData);

      setShowModal(true);
    } catch (err) {
      console.error(err);

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
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  };
};
