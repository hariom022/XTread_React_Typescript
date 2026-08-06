import { useMemo, useState } from "react";

// import ReceivingTabs from "../components/ReceivingTabs";
import ReceivingFilters from "../components/ReceivingFilters";

import CollectionTable from "../components/CollectionTable";
import BatchTable from "../components/BatchTable";
import BarcodeTable from "../components/BarcodeTable";
import NotReceivedTable from "../components/NotReceivedTable";

import DetailModal from "../components/DetailModal";

import { useReceiving } from "../hooks/useReceiving";

import receiveService from "../services/receiveService";

import type { ReceivingRow } from "../types/receiving.types";

import EditCasing from "../../collection/components/forms/EditCasing";

import "../style/Receiving.css";
import { RingLoader } from "react-spinners";

const ReceivingPage = () => {
  const {
    activeTab,
    setActiveTab,
    collectionLoading,
    batchLoading,
    barcodeLoading,
    notReceivedLoading,
    selectedDate,
    setSelectedDate,

    inspections,

    batchList,

    casingList,

    notReceivedList,

    selectedRows,
    setSelectedRows,
    groupedByCustomer,
    groupedBatches,

    expandedBatch,

    selectedBatches,

    toggleBatch,

    toggleBatchSelection,
    loadCollectionOrders,

    selectedCasingRows,

    toggleCasingRow,

    setSelectedCasingRows,
    loadBarcodeOrders,
    loadBatchOrders,
  } = useReceiving();

  const [selectedCustomer, setSelectedCustomer] = useState("all");

  const [selectedRow, setSelectedRow] = useState<ReceivingRow | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedCasing, setSelectedCasing] = useState<any>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [proceedLoading, setProceedLoading] = useState(false);
  // ==========================
  // CUSTOMER DROPDOWN
  // ==========================
  const customerOptions = useMemo(() => {
    const customers = [
      "all",

      ...new Set(inspections.map((x) => x.customerName).filter(Boolean)),
    ];

    return customers.map((c) => ({
      value: c,
      label: c === "all" ? "All Customers" : c,
    }));
  }, [inspections]);

  // ==========================
  // FILTER DATA
  // ==========================
  // const filteredCollectionData = useMemo(() => {
  //   return inspections.filter((item) => {
  //     const customerMatch =
  //       selectedCustomer === "all" || item.customerName === selectedCustomer;

  //     const dateMatch = !selectedDate || item.date === selectedDate;

  //     return customerMatch && dateMatch;
  //   });
  // }, [inspections, selectedCustomer, selectedDate]);
  const filteredGroupedByCustomer = useMemo(() => {
    const filtered = inspections.filter((item) => {
      const customerMatch =
        selectedCustomer === "all" || item.customerName === selectedCustomer;

      const dateMatch =
        !selectedDate || item.date?.split("T")[0] === selectedDate;

      return customerMatch && dateMatch;
    });

    return filtered.reduce((acc: any, item) => {
      const customer = item.customerName;

      if (!acc[customer]) {
        acc[customer] = [];
      }

      acc[customer].push(item);

      return acc;
    }, {});
  }, [inspections, selectedCustomer, selectedDate]);

  // const filteredBatchList = useMemo(() => {
  //   return batchList.filter((item) => {
  //     const customerMatch =
  //       selectedCustomer === "all" ||
  //       item.customerName === selectedCustomer;

  //     const dateMatch =
  //       !selectedDate ||
  //       item.date === selectedDate;

  //     return customerMatch && dateMatch;
  //   });
  // }, [batchList, selectedCustomer, selectedDate]);
  const groupedBatchByCustomer = useMemo(() => {
    const filtered = batchList.filter((item) => {
      const customerMatch =
        selectedCustomer === "all" || item.customerName === selectedCustomer;

      const dateMatch = !selectedDate || item.date === selectedDate;

      return customerMatch && dateMatch;
    });

    const map: Record<string, ReceivingRow[]> = {};

    filtered.forEach((item) => {
      const key = item.customerName || "Unknown Customer";

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item);
    });

    return map;
  }, [batchList, selectedCustomer, selectedDate]);

  const filteredGroupedBatches = useMemo(() => {
    const filtered = casingList.filter((item) => {
      const customerMatch =
        selectedCustomer === "all" || item.customerName === selectedCustomer;

      const dateMatch = !selectedDate || item.date === selectedDate;

      return customerMatch && dateMatch;
    });

    const map: Record<string, ReceivingRow[]> = {};

    filtered.forEach((item) => {
      const key = item.batchNo || "No Batch";

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item);
    });

    return map;
  }, [casingList, selectedCustomer, selectedDate]);

  // ==========================
  // VIEW DETAILS
  // ==========================
  const handleView = (row: ReceivingRow) => {
    setSelectedRow(row);
    setShowDetailModal(true);
  };

  // ==========================
  // RECEIVE CASINGS
  // ==========================
  const handleReceive = async () => {
    if (selectedRows.length === 0) {
      alert("Select at least one casing.");
      return;
    }

    try {
      await receiveService.confirmReceive({
        orderCasingIds: selectedRows,
        isReceived: true,
      });

      alert("Received Successfully");

      setSelectedRows([]);

      await loadCollectionOrders();
      await loadBatchOrders();
    } catch (error) {
      console.error(error);

      alert("Failed to receive casings");
    }
  };

  // ==========================
  // REJECT CASINGS
  // ==========================
  const handleReject = async () => {
    if (selectedRows.length === 0) {
      alert("Select at least one casing.");
      return;
    }

    try {
      await receiveService.confirmReceive({
        orderCasingIds: selectedRows,
        isReceived: false,
      });

      alert("Rejected Successfully");

      setSelectedRows([]);

      await loadCollectionOrders();
    } catch (error) {
      console.error(error);

      alert("Failed to reject casings");
    }
  };

  // ==========================
  // CREATE BATCH
  // ==========================
  const handleCreateBatch = async () => {
    if (selectedCasingRows.length === 0) {
      alert("Select at least one casing.");
      return;
    }

    // Check that all selected casings belong to the same customer
    const selectedItems = batchList.filter((x) =>
      selectedCasingRows.includes(String(x.id)),
    );

    const customerIds = [...new Set(selectedItems.map((x) => x.customerId))];

    if (customerIds.length > 1) {
      alert("Please select casings from a single customer only.");
      return;
    }

    try {
      const payload = {
        orderCasingIds: selectedCasingRows.map((id) => Number(id)),
      };

      console.log("Payload =>", payload);

      await receiveService.createBatch(payload);

      alert("Batch Created Successfully");

      setSelectedCasingRows([]);

      await loadCollectionOrders();
      await loadBatchOrders();
      await loadBarcodeOrders();

      setActiveTab("barcode");
    } catch (error) {
      console.error(error);

      alert("Failed to create batch");
    }
  };
  // const handleCreateBatch = async () => {
  //   if (selectedCasingRows.length === 0) {
  //     alert("Select at least one casing.");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       orderCasingIds: selectedCasingRows.map((id) => Number(id)),
  //     };

  //     console.log("Payload =>", payload);

  //     await receiveService.createBatch(payload);

  //     alert("Batch Created Successfully");

  //     setSelectedCasingRows([]);

  //     // refresh tabs
  //     await loadCollectionOrders();
  //     await loadBarcodeOrders();

  //     // optionally move to barcode tab
  //     setActiveTab("barcode");
  //   } catch (error) {
  //     console.error(error);

  //     alert("Failed to create batch");
  //   }
  // };

  // const handleProceedToNextStage = async () => {
  //   alert("Proceed API pending");
  // };

  const handleProceedToNextStage = async () => {
    try {
      const selectedItems = Object.entries(groupedBatches)
        .filter(([batchNo]) => selectedBatches.includes(batchNo))
        .flatMap(([, items]) => items);

      if (selectedItems.length === 0) {
        alert("Please select batch");
        return;
      }
      setProceedLoading(true);

      const payload = {
        orderCasingIds: selectedItems.map((item) => Number(item.id)),
      };

      console.log("Proceed Payload =>", payload);

      await receiveService.createVisualInspection(payload);

      alert("Moved to Visual Inspection Successfully");

      await loadBarcodeOrders();
      await loadCollectionOrders();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to move next stage",
      );
    }
    finally {
    setProceedLoading(false);
  }
  };

  const toggleAllCasing = () => {
    if (selectedCasingRows.length === batchList.length) {
      setSelectedCasingRows([]);
    } else {
      setSelectedCasingRows(batchList.map((item) => String(item.id)));
    }
  };

  const handleOpenEdit = (casing: any) => {
    console.log("EDIT CASING", casing);
    console.log(" COLLECTION ORDER NUMBER", casing?.orderNumber);
    setSelectedCasing(casing);

    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);

    setSelectedCasing(null);
  };

  const handleSaveEdit = async () => {
    await loadCollectionOrders();

    setShowEditModal(false);

    setSelectedCasing(null);
  };
  console.log("selectedCustomer", selectedCustomer);
  console.log("selectedDate", selectedDate);
  return (
    <div className="container-fluid mt-3">
      {/* TABS */}
      {/* <ReceivingTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      /> */}

      {/* FILTERS */}
      <ReceivingFilters
        customerOptions={customerOptions}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="mb-3 d-flex">
        <button
          className={`btn me-2 ${
            activeTab === "collection" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("collection")}
        >
          Collection
        </button>

        <button
          className={`btn me-2 ${
            activeTab === "batch" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("batch")}
        >
          Batch
        </button>

        <button
          className={`btn me-2 ${
            activeTab === "barcode" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("barcode")}
        >
          Barcode
        </button>

        <button
          className={`btn me-2 ${
            activeTab === "notReceived" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("notReceived")}
        >
          Not Received
        </button>
      </div>

      {/* COLLECTION TAB */}
      {activeTab === "collection" &&
        (collectionLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#dc3545" size={80} />
          </div>
        ) : (
          <CollectionTable
            groupedByCustomer={filteredGroupedByCustomer}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onReceive={handleReceive}
            onReject={handleReject}
            onView={handleView}
            onEdit={handleOpenEdit}
          />
        ))}

      {/* BATCH TAB */}
      {activeTab === "batch" &&
        (batchLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#dc3545" size={80} />
          </div>
        ) : (
          <>
            <BatchTable
              groupedData={groupedBatchByCustomer}
              selectedCasingRows={selectedCasingRows}
              toggleCasingRow={toggleCasingRow}
              toggleAllCasing={toggleAllCasing}
              onCreateBatch={handleCreateBatch}
            />

            {/* <div className="d-flex justify-content-end mt-2">
        <button
          className="btn btn-success"
          onClick={handleCreateBatch}
        >
          Create Batch
        </button>
      </div> */}
          </>
        ))}

      {/* BARCODE TAB */}
      {activeTab === "barcode" &&
        (barcodeLoading || proceedLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#dc3545" size={80} />
          </div>
        ) : (
          <BarcodeTable
            groupedBatches={filteredGroupedBatches}
            expandedBatch={expandedBatch}
            selectedBatches={selectedBatches}
            toggleBatch={toggleBatch}
            toggleBatchSelection={toggleBatchSelection}
            onProceed={handleProceedToNextStage}
          />
        ))}

      {/* NOT RECEIVED TAB */}
      {activeTab === "notReceived" && (
        <NotReceivedTable data={notReceivedList} onView={handleView} />
      )}

      {/* DETAIL MODAL */}
      <DetailModal
        show={showDetailModal}
        data={selectedRow}
        onClose={() => setShowDetailModal(false)}
      />

      {showEditModal && selectedCasing && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Edit Casing</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={handleCloseEdit}
                />
              </div>

              <div className="modal-body">
                <EditCasing
                  casing={selectedCasing}
                  onClose={handleCloseEdit}
                  onSave={handleSaveEdit}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivingPage;
