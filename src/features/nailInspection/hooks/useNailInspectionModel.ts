import { useState } from "react";
import indexPageApiService from "../../../shared/services/indexPageApiService";

export const useNailInspectionModal = () => {
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
        "NAIL CASING DETAILS",
        res.data
      );

      const casing = res.data;

      const modalData = {
        ...item,

        // Basic Info
        service:
          casing.serviceType?.name || "-",

        tyreSize:
          casing.tyreSize?.casingSize || "-",

        tyreMake:
          casing.tyreMake?.name || "-",

        model:
          casing.model || "-",

        requestedPattern:
          casing.retreadDetail?.patternName ||
          "-",

        // Retread Info
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

        // Nail Inspection Specific
        repairDetail:
          casing.repairDetail || [],

        punctureCount:
          casing.punctureCount || 0,

        patchesRemoved:
          casing.patchesRemoved || 0,

        puncturesFound:
          casing.puncturesFound || 0,

        // Raw Data
        originalCasing: casing,
      };

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