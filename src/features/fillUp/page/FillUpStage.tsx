import { useMemo, useState } from "react";
import { RingLoader } from "react-spinners";

import FillUpIndexTable from "../components/FillUpIndexTable";
import useFillUpModal from "../hooks/useFillUpModal";
import FillUpModal from "../components/FillUpModal";

import useFillUpIndexTable from "../hooks/useFillUpIndexTable";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";
import indexPageApiService from "../../../shared/services/indexPageApiService";
import type { FillUpRow } from "../types/fillUp.types";
import FillUpStockMgtModal from "../components/FillUpStockMgtModal";
import useFillUpStockMgt from "../hooks/useFillUpStockMgt";

const FillUpStage = () => {
  const { loading, filteredData, loadFillUpOrders } = useFillUpIndexTable();

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fillUpModal = useFillUpModal({
    selectedItem,

    refreshTable: loadFillUpOrders,

    onClose: () => {
      setShowModal(false);

      setSelectedItem(null);
    },
  });

  const stockMgt = useFillUpStockMgt();

  const [showModal, setShowModal] = useState(false);

  const searchedData = useMemo(() => {
    return filteredData.filter((item) =>
      `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.customerName}
       ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, filteredData]);

  const handleInspect = async (item: FillUpRow) => {
    try {
      setLoadingModal(true);
      const response = await indexPageApiService.getOrderCasingDetails(item.id);

      const casing = response.data.data;

      const updatedItem = {
        ...item,

        casing: casing.productionNumber || "-",

        serial: casing.tyreReferenceNumber || "-",

        customerName: casing.customerName || "-",

        tyreSize: casing.tyreSize?.casingSize || "-",

        requestedPattern: casing.retreadDetail?.patternName || "-",

        reApprovedPattern:
          // casing.retreadDetail
          //   ?.patternName ||
          "-",
      };

      setSelectedItem(updatedItem);

      setShowModal(true);
    } catch (error) {
      console.error(error);

      alert("Unable to load casing details");
    }finally{
      setLoadingModal(false);
    }
  };
  return (
    <div className="container-fluid mt-2">
      {/* SEARCH + STOCK MGT + INCIDENT REPORT */}

      <div className="row g-2 mb-1">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            style={{ height: "43px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            style={{ height: "43px" }}
            onClick={() => setShowStockModal(true)}
          >
            Stock Management
          </button>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-danger w-100"
            style={{ height: "43px" }}
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>

      {/* TABLE */}

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "400px",
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <FillUpIndexTable data={searchedData} onInspect={handleInspect} />
      )}

      {/* APPROVAL MODAL */}

      {showModal && selectedItem && (
        <FillUpModal
          selectedItem={selectedItem}
          fillUpType={fillUpModal.fillUpType}
          setFillUpType={fillUpModal.setFillUpType}
          fillUpTypes={fillUpModal.fillUpTypes}
          handleSave={fillUpModal.handleSave}
          onClose={() => {
            fillUpModal.resetModal();
            setSelectedItem(null);
            setShowModal(false);
          }}
        />
      )}

      {/* STOCK MANAGEMENT */}
      {showStockModal && (
        <FillUpStockMgtModal
          {...stockMgt}
          onClose={() => {
            stockMgt.resetStockMgt();

            setShowStockModal(false);
          }}
        />
      )}

      {/* INCIDENT REPORT */}

      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
      {/* loader */}
      {(loadingModal || fillUpModal.processing) && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(255,255,255,0.6)",
      zIndex: 99999,
    }}
  >
    <RingLoader color="#b30815" size={80} />
  </div>
)}
    </div>
    
  );
};

export default FillUpStage;
