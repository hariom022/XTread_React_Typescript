import { useState, useEffect } from "react";

import type {
  AllocatedRailRow,
  EnvelopingRow,
  Rail,
  // RailType,
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


  const resetModal = () => {
    setSelectedRailId(null);

    setAvailableRows([]);

    setAllocatedRows([]);
  };

  const allocateRail = (row: EnvelopingRow, railNo: number) => {
    const exists = allocatedRows.some((x) => x.railNo === railNo);

    if (exists) {
      alert(`Rail ${railNo} already allocated`);

      return;
    }
    const selectedRail = rails.find((x) => x.railId === selectedRailId);
    const newRow = {
      ...row,

      railLocation: selectedRail?.name ?? "",

      railNo,
    };

    setAllocatedRows((prev) => {
  const updated = [...prev, newRow];

  console.log(
    "Allocated Rows After Add",
    updated
  );

  return updated;
});


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

  // const processEnvelope =
  //   async () => {
  //     try {
  //       if (
  //         !allocatedRows.length
  //       ) {
  //         alert(
  //           "Please allocate at least one casing",
  //         );

  //         return;
  //       }

  //       await envelopingServiceApi.processEnvelope(
  //         allocatedRows,
  //       );

  //       alert(
  //         "Envelope Processed Successfully",
  //       );

  //       refreshTable();

  //       resetModal();
  //     } catch (
  //     error
  //     ) {
  //       console.error(
  //         error,
  //       );
  //     }
  //   };
  const [rails, setRails] = useState<Rail[]>([]);
//   const [railPipeInfo, setRailPipeInfo] = useState<{
//   railId: number;
//   railPipeId: number;
// } | null>(null);
//   const processEnvelope = async () => {
//   try {
//     if (!allocatedRows.length) {
//       alert("Please allocate at least one casing");
//       return;
//     }

//     if (!selectedRailId) {
//       alert("Please select a rail");
//       return;
//     }

//     const responses = await Promise.all(
//       allocatedRows.map((row) =>
//         envelopingServiceApi.processEnvelope(
//           selectedRailId,
//           {
//             pipeName: row.railLocation,
//             sortOrder: row.railNo ?? 0,
//           }
//         )
//       )
//     );

//     console.log(
//       "Process Responses",
//       responses
//     );

//     setAllocatedRows((prev) =>
//       prev.map((row, index) => ({
//         ...row,
//         railId:
//           responses[index].data.railId,
//         railPipeId:
//           responses[index].data.railPipeId,
//       }))
//     );

//     alert(
//       "Envelope Processed Successfully"
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };
const processEnvelope = async () => {
  try {
    if (!allocatedRows.length) {
      alert("Please allocate at least one casing");
      return;
    }

    if (!selectedRailId) {
      alert("Please select a rail");
      return;
    }

    // Step 1: Create/Get Rail Pipes
    const responses = await Promise.all(
      allocatedRows.map(async (row) => {
        const response = await envelopingServiceApi.processEnvelope(
          selectedRailId,
          {
            pipeName: row.railLocation,
            sortOrder: row.railNo ?? 0,
          }
        );

        console.log("Process Envelope Response", response.data);

        return response.data;
      })
    );

    // Step 2: Prepare Assign Payload
    const payload = {
      casings: allocatedRows.map((row, index) => ({
        orderCasingId: String(row.orderCasingId),
        railId: String(responses[index].railId),
        railPipeId: String(responses[index].railPipeId),
      })),
    };

    console.log("Assign Payload", payload);

    // Step 3: Call Assign API
    await envelopingServiceApi.assignEnvelope(payload);
    return allocatedRows.map((row, index) => ({
  ...row,
  railId: responses[index].railId,
  railPipeId: responses[index].railPipeId,
}));

    alert("Envelope Assigned Successfully");

    // Optional
    // await loadData();
    // setAllocatedRows([]);
    // onClose();

  } catch (error: any) {
    console.error(error);

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to process envelope";

    alert(message);
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
  useEffect(() => {
  if (allocatedRows.length > 0) {
    console.log(
      "First Allocated Row",
      allocatedRows[0]
    );
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
  };
};

export default useEnvelopingBatchModal;
