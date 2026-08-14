import { useState,useEffect } from "react";

import curingServiceApi from "../service/curingServiceApi";

import type { CuringRow, AllocatedPipeRow } from "../type/curing.types";

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
const [selectedMold, setSelectedMold] =
  useState<number | "">("");
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
    // =======================
    // rejection Reasons
    // =======================
    const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);

const loadRejectionReasons = async () => {
  try {
    const response = await curingServiceApi.getRejectionReasons();
    setRejectionReasons(response.data.data);
  } catch (error) {
    console.error("Failed to load rejection reasons", error);
  }
};
useEffect(() => {
  loadRejectionReasons();
}, []);
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

  const allocatePipe = (
    row: CuringRow,
    pipeNo: number,
    pipeName: string,
    autoclavePipeId: number,
  ) => {
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

      const payload = {
        casings: allocatedRows.map((row) => ({
          orderCasingId: String(row.orderCasingId),
          autoclaveId: String(row.autoclaveId),
          autoclavePipeId: String(row.autoclavePipeId),
        })),
      };

      console.log("LOAD CURING PAYLOAD", payload);

      await curingServiceApi.loadCuring(payload);

      alert("Curing Assigned Successfully");

      refreshTable();
    } catch (error) {
      console.error(error);
      alert("Failed To Assign Curing");
    }
  };

  const loadMoldCuring = async (
  rows: CuringRow[],
  moldId: number,
) => {
  try {
    if (!rows.length) {
      alert("Select at least one casing.");
      return;
    }

    const payload = {
      casings: rows.map((row) => ({
        orderCasingId: String(row.orderCasingId),

        // Mold curing does not use Autoclave
        autoclaveId: "0",

        // Mold curing does not use Pipe
        autoclavePipeId: "0",

        // Selected Mold
        moldId: String(moldId),
      })),
    };

    console.log("MOLD CURING PAYLOAD", payload);

    await curingServiceApi.loadCuring(payload);

    alert("Mold Curing Assigned Successfully");

    refreshTable();
  } catch (error) {
    console.error("Mold Curing Error:", error);
    alert("Failed To Assign Mold Curing");
  }
};

  /* =========================
        RESET
  ========================= */

 const resetModal = () => {
  setSelectedAutoclave("");
  setSelectedMold("");

  setAvailableRows([]);
  setAllocatedRows([]);
  setSelectedAllocatedRow(null);
};

  return {
    loading,

    selectedAutoclave,
    setSelectedAutoclave,

    selectedMold,
  setSelectedMold,

    availableRows,
    allocatedRows,

    selectedAllocatedRow,
    setSelectedAllocatedRow,

    fetchApprovedFromEnveloping,

    allocatePipe,

    removeFromPipe,

    loadCuring,
    loadMoldCuring,
    
    rejectionReasons,
    loadRejectionReasons,

    resetModal,
  };
};

export default useCuringBatchModal;
