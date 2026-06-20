import { useState } from "react";

import curingServiceApi from "../service/curingServiceApi";

import type {
  CuringRow,
  AllocatedPipeRow,
} from "../type/curing.types";

interface Props {
  refreshTable: () => void;
}

const useCuringBatchModal = ({ refreshTable }: Props) => {
  /* =========================
        LOADING
  ========================= */

  const [loading, setLoading] = useState(false);

  /* =========================
        CHAMBER
  ========================= */

  const [selectedAutoclave, setSelectedAutoclave] = useState<number | "">("");

  /* =========================
        AVAILABLE
  ========================= */

  const [availableRows, setAvailableRows] = useState<CuringRow[]>([]);

  /* =========================
        ALLOCATED
  ========================= */

  const [allocatedRows, setAllocatedRows] = useState<AllocatedPipeRow[]>([]);

  /* =========================
        SELECTED ALLOCATED
  ========================= */

  const [selectedAllocatedRow, setSelectedAllocatedRow] =
    useState<AllocatedPipeRow | null>(null);

  /* =========================
        FETCH
        APPROVED FROM
        ENVELOPING
  ========================= */

  const fetchApprovedFromEnveloping = async () => {
    try {
      setLoading(true);

      /*
          STAGE = 14
          CURING
        */

      const response = await curingServiceApi.getApprovedFromEnveloping();

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
        PIPE ALLOCATION
  ========================= */

  const allocatePipe = (row: CuringRow, pipeNo: number, pipeName: string,autoclavePipeId: number) => {
    const exists = allocatedRows.some((x) => x.pipeNo === pipeNo);

    if (exists) {
      alert(`Pipe ${pipeNo} already allocated`);

      return;
    }

    const newRow: AllocatedPipeRow = {
      ...row,

      autoclaveId: Number(selectedAutoclave),
      autoclavePipeId,
      pipeName,
      pipeNo,
    };

    setAllocatedRows((prev) => [...prev, newRow]);

    setAvailableRows((prev) =>
      prev.filter((x) => x.orderCasingId !== row.orderCasingId),
    );
  };

  /* =========================
        REMOVE
  ========================= */

  const removeFromPipe = () => {
    if (!selectedAllocatedRow) {
      alert("Please select a row");

      return;
    }

    setAllocatedRows((prev) =>
      prev.filter(
        (x) => x.orderCasingId !== selectedAllocatedRow.orderCasingId,
      ),
    );

    setAvailableRows((prev) => [...prev, selectedAllocatedRow]);

    setSelectedAllocatedRow(null);
  };

  /* =========================
        LOAD CURING
  ========================= */

const loadCuring = async () => {
  try {
    if (!allocatedRows.length) {
      alert("Allocate Pipe First");
      return;
    }

    refreshTable();
  } catch (error) {
    console.error(error);
  }
};

  /* =========================
        RESET
  ========================= */

  const resetModal = () => {
  setSelectedAutoclave("");

    setAvailableRows([]);

    setAllocatedRows([]);

    setSelectedAllocatedRow(null);
  };

  return {
    loading,

    selectedAutoclave,
  setSelectedAutoclave,

    availableRows,
    allocatedRows,

    selectedAllocatedRow,
    setSelectedAllocatedRow,

    fetchApprovedFromEnveloping,

    allocatePipe,

    removeFromPipe,

    loadCuring,

    resetModal,
  };
};

export default useCuringBatchModal;
