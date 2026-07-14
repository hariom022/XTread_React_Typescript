import { useMemo, useState } from "react";

import { RingLoader } from "react-spinners";

import DispatchIndexTable from "../components/DispatchIndexTable";

import useDispatchIndexTable from "../hooks/useDispatchIndexTable";
import DispatchTeamModal from "../components/DispatchTeamModal";
// import DispatchDetails from "../components/DispatchDetails";
import ProductionSuccessModal from "../components/ProductionSuccessModal";
import CustomerDeliveryOrderModal from "../components/CustomerDeliveryOrderModal";

import type {
  DispatchTeam,
  ProductionSuccessData,
  CustomerDeliveryPayload,
  DispatchFinalizationRow,
} from "../type/dispatch.types";
import DispatchFinalizationModal from "../components/DispatchFinallizationModal";

const DispatchStage = () => {
  const { rows, loading } = useDispatchIndexTable();

  const [search, setSearch] = useState("");

  const [showDispatchTeamModal, setShowDispatchTeamModal] = useState(false);

  const [showFinalizationModal, setShowFinalizationModal] = useState(false);

  const [showCustomerDeliveryModal, setShowCustomerDeliveryModal] =
    useState(false);

  const [showProductionModal, setShowProductionModal] = useState(false);

  const [finalDispatchList, setFinalDispatchList] = useState<
    DispatchFinalizationRow[]
  >([]);
  const [dispatchIndexRows, setDispatchIndexRows] = useState<
    DispatchFinalizationRow[]
  >([]);
  const [productionData, setProductionData] =
    useState<ProductionSuccessData | null>(null);

    const [showDispatchDetails, setShowDispatchDetails] = useState(false);

const [selectedDispatch, setSelectedDispatch] =
  useState<DispatchFinalizationRow | null>(null);
  
  const [dispatchTeam, setDispatchTeam] = useState<DispatchTeam>({
    salesRep: "",
    courierName: "",
    regNo: "",
    driverName: "",
    driverId: "",
  });
  const [isInternal, setIsInternal] = useState(false);
  const filteredData = useMemo(() => {
    return rows.filter((item) =>
      `${item.deliveryNo}
             ${item.customerName}
             ${item.salesRep}
             ${item.courierName}
             ${item.driverName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [rows, search]);

  return (
    <div className="container-fluid box mt-3">
      <div className="col">
        <div
          className=" d-flex justify-content-between"
          style={{ alignItems: "center" }}
        >
          <button
            className="btn btn-primary p-4 mt-1"
            onClick={() => setShowDispatchTeamModal(true)}
          >
            <h4>Create Delivery Sheet</h4>
          </button>

          <div
            className="d-flex justify-content-center p-2 "
            style={{
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h1>
              {" "}
              <b>Dispatch Stage </b>
            </h1>
          </div>
          {/* Dispatch Initiallisation */}
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success p-3"
              onClick={() => setShowFinalizationModal(true)}
            >
              <h3>🚚 Dispatch Initialisation</h3>
            </button>
          </div>
        </div>

        <hr />

        {/* TABLE */}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "300px",
            }}
          >
            <RingLoader color="#b30815" size={80} />
          </div>
        ) : (
          <DispatchIndexTable data={dispatchIndexRows}  />
        )}
      </div>
      {/* NEXT STEP */}
      <DispatchTeamModal
        show={showDispatchTeamModal}
        onClose={() => {
          setShowDispatchTeamModal(false);
        }}
        setDispatchTeam={setDispatchTeam}
        setIsInternal={setIsInternal}
        onContinue={() => {
          setShowDispatchTeamModal(false);
          setShowCustomerDeliveryModal(true);
        }}
      />
      <CustomerDeliveryOrderModal
        show={showCustomerDeliveryModal}
        dispatchTeam={dispatchTeam}
        setDispatchTeam={setDispatchTeam}
        isInternal={isInternal}
        onClose={() => setShowCustomerDeliveryModal(false)}
        onSave={(payload: CustomerDeliveryPayload) => {
          setProductionData({
            customer: payload.customer,
            deliveryNo: payload.deliveryNo,
          });
          setDispatchTeam({
            salesRep: "",
            courierName: "",
            regNo: "",
            driverName: "",
            driverId: "",
          });
          setFinalDispatchList((prev) => [
            ...prev,
            {
              id: Date.now(),

              date: new Date().toLocaleDateString("en-GB"),

              deliveryNo: payload.deliveryNo,

              salesRep: dispatchTeam.salesRep,

              customerName: payload.customer ?? "",

              courierName: dispatchTeam.courierName,

              driverName: dispatchTeam.driverName,

              zone: "North Zone",

              vehicle: dispatchTeam.regNo,

              status: "Pending",

              casings: payload.casings,
            },
          ]);

          setShowCustomerDeliveryModal(false);

          setShowProductionModal(true);
        }}
      />

      <ProductionSuccessModal
        show={showProductionModal}
        data={productionData}
        onClose={() => {
          setShowProductionModal(false);

          setProductionData(null);
        }}
      />

      {/* Dispatch Finalization Modal */}

      <DispatchFinalizationModal
        show={showFinalizationModal}
        rows={finalDispatchList}
        onClose={() => setShowFinalizationModal(false)}
        onFinalize={(row) => {
          // Add to main Dispatch table
          setDispatchIndexRows((prev) => [
            ...prev,
            {
              ...row,
              status: "Finalized",
            },
          ]);

          // Remove from Dispatch Initialisation
          setFinalDispatchList((prev) =>
            prev.filter((item) => item.id !== row.id),
          );
        }}
      />
    </div>
  );
};

export default DispatchStage;
