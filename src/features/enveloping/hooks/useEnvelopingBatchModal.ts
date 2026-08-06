import { useState, useEffect } from "react";

import type {
  AllocatedRailRow,
  EnvelopingRow,
  Rail,
  RailPipe,
} from "../type/enveloping.type";
import envelopingServiceApi from "../services/envelopingServiceApi";

interface Props {
  refreshTable: () => void;
}
const useEnvelopingBatchModal = ({ refreshTable }: Props) => {
  const [loading, setLoading] = useState(false);

  const fetchApprovedFromPreviousStage = async () => {
    try {
      setLoading(true);

      const response = await envelopingServiceApi.getEnvelopingOrders();

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

  // useEffect(() => {
  //   fetchApprovedFromPreviousStage();
  // }, []);

  const [selectedRailId, setSelectedRailId] = useState<number | null>(null);

  const [availableRows, setAvailableRows] = useState<EnvelopingRow[]>([]);

  const [allocatedRows, setAllocatedRows] = useState<AllocatedRailRow[]>([]);

  const [pipes, setPipes] = useState<RailPipe[]>([]);
  const resetModal = () => {
    setSelectedRailId(null);

    setAvailableRows([]);

    setAllocatedRows([]);
  };

  //   const allocateRail = (row: EnvelopingRow, railNo: number) => {
  //     const exists = allocatedRows.some((x) => x.railNo === railNo);

  //     if (exists) {
  //       alert(`Rail ${railNo} already allocated`);

  //       return;
  //     }
  //     const selectedRail = rails.find((x) => x.railId === selectedRailId);
  //     const newRow = {
  //       ...row,

  //       railLocation: selectedRail?.name ?? "",

  //       railNo,
  //     };

  //     setAllocatedRows((prev) => {
  //   const updated = [...prev, newRow];

  //   console.log(
  //     "Allocated Rows After Add",
  //     updated
  //   );

  //   return updated;
  // });

  //     setAvailableRows((prev) =>
  //       prev.filter((x) => x.orderCasingId !== row.orderCasingId),
  //     );
  //   };
  const allocateRail = (row: EnvelopingRow, pipe: RailPipe) => {
    const selectedRail = rails.find((x) => x.railId === selectedRailId);

    const newRow = {
      ...row,
      railLocation: selectedRail?.name ?? "",
      railNo: Number(pipe.pipeName),
      railId: pipe.railId,
      railPipeId: pipe.railPipeId, // ✅ Save this
    };

    setAllocatedRows((prev) => [...prev, newRow]);

    setAvailableRows((prev) =>
      prev.filter((x) => x.orderCasingId !== row.orderCasingId),
    );
  };
  const removeFromRail = (row: AllocatedRailRow) => {
    setAllocatedRows((prev) =>
      prev.filter((x) => x.orderCasingId !== row.orderCasingId),
    );

    setAvailableRows((prev) => [...prev, row]);
  };

  const [rails, setRails] = useState<Rail[]>([]);
  const processEnvelope = async () => {
    try {
      if (!allocatedRows.length) {
        alert("Please allocate at least one casing");
        return false;
      }

      const payload = {
        casings: allocatedRows.map((row) => ({
          orderCasingId: String(row.orderCasingId),
          railId: String(selectedRailId),
          railPipeId: String(row.railPipeId),
        })),
      };
      console.log("Assign Payload", payload);
      await envelopingServiceApi.assignEnvelope(payload);

      // await refreshTable();
      // resetModal();

      return true;
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Failed to assign envelope";

      alert(message);

      return false;
    }
  };

  const loadRails = async () => {
    try {
      const {
        data: { data },
      } = await envelopingServiceApi.getRailsTypes();

      setRails(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadRails();
  }, []);
  const loadPipes = async (railId: number) => {
    try {
      const {
        data: { data },
      } = await envelopingServiceApi.getRailPipes(railId);

      setPipes(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (selectedRailId) {
      loadPipes(selectedRailId);
    } else {
      setPipes([]);
    }
  }, [selectedRailId]);
  useEffect(() => {
    if (allocatedRows.length > 0) {
      console.log("First Allocated Row", allocatedRows[0]);
    }
  }, [allocatedRows]);

  return {
    selectedRailId,
    setSelectedRailId,

    availableRows,
    setAvailableRows,

    allocatedRows,

    allocateRail,

    removeFromRail,

    processEnvelope,
    loading,
    fetchApprovedFromPreviousStage,
    resetModal,
    rails,
    pipes,
  };
};

export default useEnvelopingBatchModal;
