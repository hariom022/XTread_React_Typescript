import { useState, useEffect } from "react";

// import type {
//   AllocatedRailRow,
//   EnvelopingRow,
//   Rail,
//   RailPipe,
// } from "../type/mounting.type";
import type { AllocatedMountingRow,MountingRow,MountingSize } from "../types/mounting.type";
// import envelopingServiceApi from "../services/envelopingServiceApi";
import mountingServiceApi from "../service/mountingServiceApi";

interface Props {
  refreshTable: () => void;
}
const useMountingBatchModal = ({ refreshTable }: Props) => {
  const [loading, setLoading] = useState(false);

  const fetchApprovedFromPreviousStage = async () => {
    try {
      setLoading(true);

      const response = await mountingServiceApi.getmountingOrders();

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


  const [selectedMountingSizeId, setSelectedMountingSizeId] = useState<number | null>(null);

  const [availableRows, setAvailableRows] = useState<MountingRow[]>([]);

  const [allocatedRows, setAllocatedRows] = useState<AllocatedMountingRow[]>([]);

  const [pipes, setPipes] = useState<MountingSize[]>([]);
  const resetModal = () => {
    setSelectedMountingSizeId(null);

    setAvailableRows([]);

    setAllocatedRows([]);
  };

  
  const allocateRail = (row: MountingRow, pipe: MountingSize) => {
    const selectedRail = rails.find((x) => x.mountingSizeId === selectedMountingSizeId);

    const newRow = {
      ...row,
      mountingSize: selectedRail?.mountingSize ?? "",
      mountingSizeId: pipe.mountingSizeId,
    };

    setAllocatedRows((prev) => [...prev, newRow]);

    setAvailableRows((prev) =>
      prev.filter((x) => x.orderCasingId !== row.orderCasingId),
    );
  };
  const removeFromRail = (row: AllocatedMountingRow) => {
    setAllocatedRows((prev) =>
      prev.filter((x) => x.orderCasingId !== row.orderCasingId),
    );

    setAvailableRows((prev) => [...prev, row]);
  };

  const [rails, setRails] = useState<MountingSize[]>([]);
  const processMounting = async () => {
    try {
      if (!allocatedRows.length) {
        alert("Please allocate at least one casing");
        return false;
      }

      const payload = {
        casings: allocatedRows.map((row) => ({
          orderCasingId: String(row.orderCasingId),
          mountingSizeId: String(selectedMountingSizeId),
          
        })),
      };
      console.log("Assign Payload", payload);
      // await mountingServiceApi.assignMounting(payload);

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

  
  // const loadPipes = async (railId: number) => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await envelopingServiceApi.getRailPipes(railId);

  //     setPipes(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   if (selectedRailId) {
  //     loadPipes(selectedRailId);
  //   } else {
  //     setPipes([]);
  //   }
  // }, [selectedRailId]);
  // useEffect(() => {
  //   if (allocatedRows.length > 0) {
  //     console.log("First Allocated Row", allocatedRows[0]);
  //   }
  // }, [allocatedRows]);

  return {
    // selectedRailId,
    // setSelectedRailId,

    availableRows,
    setAvailableRows,

    allocatedRows,

    allocateRail,

    removeFromRail,

    processMounting,
    loading,
    fetchApprovedFromPreviousStage,
    resetModal,
    rails,
    pipes,
  };
};

export default useMountingBatchModal;
