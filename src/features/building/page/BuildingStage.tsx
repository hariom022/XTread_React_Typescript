import { useMemo, useState } from "react";

import { RingLoader } from "react-spinners";

import BuildingIndexTable from "../components/BuildingIndexTable";

import useBuildingIndexTable from "../hooks/useBuildingIndexTable";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";

import indexPageApiService from "../../../shared/services/indexPageApiService";
import BuildingModal from "../components/BuildingModal";
import useBuildingModal from "../hooks/useBuildingModal";

import type { BuildingRow } from "../type/building.types";
// import "../style/buildingStage.css"

const BuildingStage = () => {
  const {
    loading,
    filteredData,
    loadBuildingOrders,
  } = useBuildingIndexTable();

  const [search, setSearch] =
    useState("");

  const [
    showIncidentModal,
    setShowIncidentModal,
  ] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<any>(null);
  const [showModal, setShowModal] =
    useState(false);
  const buildingModal =
    useBuildingModal({
      selectedItem,

      onClose: () => {
        setShowModal(false);

        setSelectedItem(null);
      },

      refreshTable:
        loadBuildingOrders,
    });
  const searchedData =
    useMemo(() => {
      return filteredData.filter(
        (item) =>
          `${item.casing}
             ${item.serial}
             ${item.patternName}
             ${item.customerName}
             ${item.batchNo}`
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ),
      );
    }, [search, filteredData]);

  const handleInspect = async (
    item: BuildingRow,
  ) => {
    try {
      const response =
        await indexPageApiService.getOrderCasingDetails(
          item.id,
        );

      const casing =
        response.data;

      console.log(
        "BUILDING CASING DETAILS",
        casing,
      );

      const updatedItem = {
        ...item,

        casing:
          casing.productionNumber || "-",

        serial:
          casing.tyreReferenceNumber || "-",

        customerName:
          casing.customerName || "-",

        tyreSize:
          casing.tyreSize
            ?.casingSize || "-",

        requestedPattern:
          casing.retreadDetail
            ?.patternName || "-",

        tyreMake:
          casing.tyreMake?.name ||
          "-",

        model:
          casing.model || "-",

        brand:
          casing.retreadDetail
            ?.brand || "-",

        treadPatternId:
          casing.retreadDetail
            ?.treadPatternId,

        width:
          casing.retreadDetail
            ?.width || "-",
      };

      setSelectedItem(
        updatedItem,
      );

      // buildingModal.setSelectedPattern(
      //   updatedItem.requestedPattern,
      // );

      setShowModal(true);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to load casing details",
      );
    }
  };

  return (
    <div className="container-fluid mt-3">

      {/* SEARCH + INCIDENT */}

      <div className="row mb-3">

        <div className="col-md-10">

          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
          />

        </div>

        <div className="col-md-2">

          <button
            className="btn btn-danger w-100"
            style={{ height: "43px" }}
            onClick={() =>
              setShowIncidentModal(
                true,
              )
            }
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
            minHeight:
              "400px",
          }}
        >
          <RingLoader
            color="#b30815"
            size={80}
          />
        </div>
      ) : (
        <BuildingIndexTable
          data={
            searchedData
          }
          onInspect={
            handleInspect
          }
        />
      )}

      {/* BUILDING MODAL */}

      {showModal &&
        selectedItem && (
          <BuildingModal
            selectedItem={selectedItem}

            selectedPattern={
              buildingModal.selectedPattern
            }

            selectedWidth={
              buildingModal.selectedWidth
            }

            setSelectedWidth={
              buildingModal.setSelectedWidth
            }

            widthOptions={
              buildingModal.widthOptions
            }

            handleApprove={() => { }}

            handleReturnToRepair={() => { }}

            onClose={() => {
              buildingModal.resetModal();

              setSelectedItem(null);

              setShowModal(false);
            }}
          />
        )}

      {/* INCIDENT REPORT */}

      {showIncidentModal && (
        <IncidentReportModal
          onClose={() =>
            setShowIncidentModal(
              false,
            )
          }
        />
      )}
    </div>
  );
};

export default BuildingStage;