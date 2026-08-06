import { useState } from "react";

import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useShearographyModal = () => {
  const [showModal, setShowModal] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<any>(null);

  const [loadingModal, setLoadingModal] =
    useState(false);

  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res =
        await indexPageApiService.getOrderCasingDetails(
          item.id
        );

      console.log(
        "SHEAROGRAPHY CASING DETAILS",
        res.data
      );

      const casing = res.data;

      const modalData = {
        ...item,

        // Header Details
        casing:
          casing.productionNumber ||
          casing.barcodeNumber ||
          item.casing,

        serial:
          casing.tyreReferenceNumber ||
          item.serial,

        customerName:
          casing.customer?.customerName ||
          item.customerName ||
          "-",

        tyreSize:
          casing.tyreSize?.casingSize ||
          item.tyreSize ||
          "-",

        requestedPattern:
          casing.retreadDetail?.patternName ||
          item.requestedPattern ||
          "-",

        // Additional Info
        service:
          casing.serviceType?.name || "-",

        tyreMake:
          casing.tyreMake?.name || "-",

        originalCasing: casing,
      };

      console.log(
        "SHEAROGRAPHY MODAL DATA",
        modalData
      );

      setSelectedItem(modalData);

      setShowModal(true);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load casing details"
      );
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