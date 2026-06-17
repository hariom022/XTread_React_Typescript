import {useState,} from "react";

import qualityControlServiceApi from "../service/qualityControlServiceApi";

import type {QualityControlDetails,} from "../type/qualityControl.type";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const useQualityControlModal =
  () => {

    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      details,
      setDetails,
    ] =
      useState<
        QualityControlDetails | null
      >(null);

    const [
      rejectReason,
      setRejectReason,
    ] = useState("");

    const [
      rejectComment,
      setRejectComment,
    ] = useState("");

    const reset =
      () => {

        setDetails(null);

        setRejectReason("");

        setRejectComment("");
      };

    const openInspection =
      async (
        orderCasingId: number,
      ) => {

        try {

          setLoading(true);

          const response =
          await indexPageApiService.getOrderCasingDetails(orderCasingId,);

          setDetails(
            response.data,
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    return {

      details,

      loading,

      rejectReason,
      setRejectReason,

      rejectComment,
      setRejectComment,

      openInspection,

      reset,
    };
  };

export default
  useQualityControlModal;