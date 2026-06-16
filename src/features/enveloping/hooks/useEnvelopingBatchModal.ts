import {
  useState, useEffect
} from "react";

import type {
  AllocatedRailRow,
  EnvelopingRow,
  RailType,
} from "../type/enveloping.type";
import envelopingServiceApi from "../services/envelopingServiceApi";

interface Props {
  refreshTable: () => void;
}
const useEnvelopingBatchModal =
  ({
    refreshTable,
  }: Props) => {

    const [
      loading,
      setLoading,
    ] = useState(false);

    const fetchApprovedFromPreviousStage =
      async () => {
        try {
          setLoading(true);

          const response =
            await envelopingServiceApi.getEnvelopingOrders();

          const stage =
            response.data.data?.[0];

          const rows =
            stage?.batches?.flatMap(
              (batch: any) =>
                batch.casings.map(
                  (casing: any) => ({
                    ...casing,
                    batchNumber:
                      batch.batchNumber,
                  }),
                ),
            ) || [];

          setAvailableRows(rows);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    // useEffect(() => {
    //   fetchApprovedFromPreviousStage();
    // }, []);


    const [
      railType,
      setRailType,
    ] =
      useState<RailType | "">(
        "",
      );

    const [
      availableRows,
      setAvailableRows,
    ] = useState<
      EnvelopingRow[]
    >([]);

    const [
      allocatedRows,
      setAllocatedRows,
    ] = useState<
      AllocatedRailRow[]
    >([]);

    const resetModal =
      () => {
        setRailType("");

        setAvailableRows(
          [],
        );

        setAllocatedRows(
          [],
        );
      };

    const allocateRail =
      (
        row: EnvelopingRow,
        railNo: number,
      ) => {
        const exists =
          allocatedRows.some(
            (x) =>
              x.railNo ===
              railNo,
          );

        if (exists) {
          alert(
            `Rail ${railNo} already allocated`,
          );

          return;
        }

        const newRow = {
          ...row,

          railLocation:
            railType,

          railNo,
        };

        setAllocatedRows(
          (
            prev,
          ) => [
              ...prev,
              newRow,
            ],
        );

        setAvailableRows(
          (
            prev,
          ) =>
            prev.filter(
              (
                x,
              ) =>
                x.orderCasingId !==
                row.orderCasingId,
            ),
        );
      };

    const removeFromRail =
      (
        row: AllocatedRailRow,
      ) => {
        setAllocatedRows(
          (
            prev,
          ) =>
            prev.filter(
              (
                x,
              ) =>
                x.orderCasingId !==
                row.orderCasingId,
            ),
        );

        setAvailableRows(
          (
            prev,
          ) => [
              ...prev,
              row,
            ],
        );
      };

    const processEnvelope =
      async () => {
        try {
          if (
            !allocatedRows.length
          ) {
            alert(
              "Please allocate at least one casing",
            );

            return;
          }

          await envelopingServiceApi.processEnvelope(
            allocatedRows,
          );

          alert(
            "Envelope Processed Successfully",
          );

          refreshTable();

          resetModal();
        } catch (
        error
        ) {
          console.error(
            error,
          );
        }
      };

    return {
      railType,
      setRailType,

      availableRows,
      setAvailableRows,

      allocatedRows,

      allocateRail,

      removeFromRail,

      processEnvelope,
      loading,
      fetchApprovedFromPreviousStage,
      resetModal,

    };
  };

export default useEnvelopingBatchModal;