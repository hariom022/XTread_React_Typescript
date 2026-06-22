import {useState,} from "react";

// import qualityControlServiceApi from "../service/qualityControlServiceApi";

import type {QualityControlDetails,} from "../type/qualityControl.type";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const useQualityControlModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [rejectComment, setRejectComment] = useState("");

  const openModal = async (item: any) => {
    try {
      setLoadingModal(true);

      const res =
        await indexPageApiService.getOrderCasingDetails(
          item.id
        );

      const casing = res.data;

      console.log("QUALITY CONTROL DETAILS", casing);

      const modalData = {
        ...item,

        productionNumber:
          casing.productionNumber || "-",

        serial:
          casing.tyreReferenceNumber || "-",

        customerName:
          casing.customerName || "-",

        tyreSize:
          casing.tyreSize?.casingSize || "-",

        requestedPattern:
          casing.retreadDetail?.patternName || "-",

        approvedPattern:
          casing.retreadDetail?.patternName || "-",

        treadWidth:
          casing.retreadDetail?.width || "-",

        repairOperations:
          casing.repairDetail?.operations || [],

        serviceType:
          casing.serviceType?.name || "-",

        receivedDate:
          casing.receivedAtUtc,

        fullDetails: casing,
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
    setRejectReason("");
    setRejectComment("");
  };

  return {
    showModal,
    selectedItem,
    loadingModal,

    rejectReason,
    setRejectReason,

    rejectComment,
    setRejectComment,

    openModal,
    closeModal,
  };
};

export default useQualityControlModal;