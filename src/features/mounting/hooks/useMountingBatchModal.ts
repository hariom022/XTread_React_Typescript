import { useState } from "react";
import type {
  AllocatedMountingRow,
  MountingRow,
} from "../types/mounting.type";
import mountingServiceApi from "../service/mountingServiceApi";

interface Props {
  refreshTable: () => void;
}

const useMountingBatchModal = ({ refreshTable }: Props) => {
  const [loading, setLoading] = useState(false);

  const [availableRows, setAvailableRows] = useState<MountingRow[]>([]);

  const [allocatedRows, setAllocatedRows] = useState<
    AllocatedMountingRow[]
  >([]);

  /* ===========================
        LOAD AVAILABLE CASINGS
  ============================ */

  const fetchApprovedFromPreviousStage = async () => {
    try {
      setLoading(true);

      const response =
        await mountingServiceApi.getmountingOrders();

      const stage = response.data.data?.[0];

      const rows =
        stage?.batches?.flatMap((batch: any) =>
          batch.casings.map((casing: any) => ({
            ...casing,
            batchNumber: batch.batchNumber,
          })),
        ) || [];

      setAvailableRows(rows);
    } catch (error) {
      console.error("Failed to load mounting casings", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
        SELECT / MOUNT CASING
  ============================ */

  const allocateMounting = (row: MountingRow) => {
    // Only ONE casing can be mounted
    if (allocatedRows.length > 0) {
      return;
    }

    const newRow: AllocatedMountingRow = {
      ...row,
      mountingSize: row.tyreSizeLabel,
    };

    // Add to mounted table
    setAllocatedRows([newRow]);

    // Remove from available table
    setAvailableRows((prev) =>
      prev.filter(
        (item) => item.orderCasingId !== row.orderCasingId,
      ),
    );
  };

  /* ===========================
        DISMOUNT CASING
  ============================ */

  const removeFromMounting = (
    row: AllocatedMountingRow,
  ) => {
    // Remove from mounted table
    setAllocatedRows((prev) =>
      prev.filter(
        (item) => item.orderCasingId !== row.orderCasingId,
      ),
    );

    // Add back to available table
    setAvailableRows((prev) => [
      ...prev,
      row as MountingRow,
    ]);
  };

  /* ===========================
        PROCESS MOUNTING
  ============================ */

const processMounting = async () => {
  try {
    if (allocatedRows.length === 0) {
      alert("Please select a casing");
      return false;
    }

    const payload = {
      orderCasingIds: allocatedRows.map(
        (row) => row.orderCasingId
      ),
    };

    console.log(
      "Mounting Assign Payload:",
      payload
    );

    const response =
      await mountingServiceApi.assignMounting(
        payload
      );

    console.log(
      "Mounting Assign Response:",
      response.data
    );

    return true;
  } catch (error: any) {
    console.error(
      "Failed to assign mounting:",
      error
    );

    console.error(
      "API Error Response:",
      error?.response?.data
    );

    let message = "Failed to process mounting";

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (
      typeof error?.response?.data === "string"
    ) {
      message = error.response.data;
    } else if (error?.response?.data) {
      message = JSON.stringify(
        error.response.data,
        null,
        2
      );
    } else if (error?.message) {
      message = error.message;
    }

    alert(message);

    return false;
  }
};

  /* ===========================
        RESET MODAL
  ============================ */

  const resetModal = () => {
    setAvailableRows([]);
    setAllocatedRows([]);
  };

  return {
    loading,

    availableRows,
    setAvailableRows,

    allocatedRows,

    allocateMounting,

    removeFromMounting,

    processMounting,

    fetchApprovedFromPreviousStage,

    resetModal,
  };
};

export default useMountingBatchModal;