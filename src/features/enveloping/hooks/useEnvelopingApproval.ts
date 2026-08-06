import {
  useState,
} from "react";

import envelopingServiceApi from "../services/envelopingServiceApi";

interface Props {
  refreshTable: () => void;
}

const useEnvelopingApproval =
  ({
    refreshTable,
  }: Props) => {
    const [
      selectedRows,
      setSelectedRows,
    ] = useState<
      number[]
    >([]);

    const resetSelection =
      () => {
        setSelectedRows(
          [],
        );
      };

    const handleApprove =
      async () => {
        try {
          if (
            !selectedRows.length
          ) {
            alert(
              "Select at least one casing",
            );

            return;
          }

          await envelopingServiceApi.approveEnvelope(
            {
              orderCasingIds:
                selectedRows,
            },
          );

          alert(
            "Approved Successfully",
          );

          refreshTable();

          resetSelection();
        } catch (
          error
        ) {
          console.error(
            error,
          );
        }
      };

    const handleReject =
      async () => {
        try {
          if (
            !selectedRows.length
          ) {
            alert(
              "Select at least one casing",
            );

            return;
          }

          await envelopingServiceApi.rejectEnvelope(
            {
              orderCasingIds:
                selectedRows,
            },
          );

          alert(
            "Rejected Successfully",
          );

          refreshTable();

          resetSelection();
        } catch (
          error
        ) {
          console.error(
            error,
          );
        }
      };

    return {
      selectedRows,

      setSelectedRows,

      handleApprove,

      handleReject,

      resetSelection,
    };
  };

export default useEnvelopingApproval;