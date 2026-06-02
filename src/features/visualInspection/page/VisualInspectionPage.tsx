import { useVisualInspection } from "../hooks/useVisualInspection";
import { useState } from "react";
import { useMemo } from "react";
import VisualInspectionTable from "../components/VisualInspectionTable";
import { RingLoader } from "react-spinners";
import IncidentReportModal from "../components/IncidentReportModal";
import VisualInspectionModal from "../components/VisualInspectionModal";
import "../styles/VisualInspect.css";
const VisualInspectionPage = () => {
  const { loading, inspections, rejectionReasons, loadVisualInspection } =
    useVisualInspection();

  const [search, setSearch] = useState("");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const openModal = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const filteredData = useMemo(() => {
    return inspections.filter((item: any) =>
      `${item.casing}
      ${item.serial}
      ${item.pattern}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [inspections, search]);

  return (
    <div className="container-fluid mt-3">
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* INCIDENT BUTTON */}
        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <VisualInspectionTable data={filteredData} onInspect={openModal} />
      )}

      {showModal && (
        <VisualInspectionModal
          item={selectedItem}
          rejectionReasons={rejectionReasons}
          onClose={() => setShowModal(false)}
          onSuccess={loadVisualInspection}
        />
      )}

      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  );
};

export default VisualInspectionPage;
