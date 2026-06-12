import { useMemo, useState } from "react";
import "../styles/PressureTest.css";

import PressureTestModal from "../components/pressureTestModal";
import PressureTestTable from "../components/pressureTestTable";

import { usePressureTest } from "../hooks/usePressureTest";

import indexPageApiService from "../../../shared/services/indexPageApiService";
import { RingLoader } from "react-spinners";
import IncidentReportModal from "../../../shared/components/IncidentReportModal";
const PressureTestPage = () => {

  const {
    loading,
    pressureTestList,
    loadPressureTestOrders,
  } = usePressureTest();

  // const { pressureTestList, loadPressureTestOrders } = usePressureTest();

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return pressureTestList.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}
         ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, pressureTestList]);

  const handleInspect = async (item: any) => {
    console.log("INSPECT CLICKED", item);

    try {
      const result =
        await indexPageApiService.getOrderCasingDetails(
          item.id
        );

      console.log("DETAIL API RESPONSE", result);

      setSelectedItem(result.data);

      console.log("SETTING SHOW MODAL TRUE");

      setShowModal(true);
    } catch (error) {
      console.error(
        "Failed to load casing details",
        error
      );
    }
  };

  console.log(
    "SHOW MODAL:",
    showModal,
    "SELECTED:",
    selectedItem
  );

  return (
    <div className="container-fluid mt-3">
      {/* SEARCH */}
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
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
          style={{ minHeight: "400px" }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <PressureTestTable
          data={filteredData}
          onInspect={handleInspect}
        />
      )}

      {/* MODAL */}
      {showModal && selectedItem && (
        <PressureTestModal
          selectedItem={selectedItem}
          onClose={() => setShowModal(false)}
          onSuccess={loadPressureTestOrders}
        />
      )}
      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  );
};

export default PressureTestPage;
