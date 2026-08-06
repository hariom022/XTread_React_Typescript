import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

import repairService from "../services/repairService";

type PatchDetail = {
  repairLocation: string;
  damageType: string;
  repairMaterial: string;
  patchSize: string;
};

type Props = {
  selectedItem: any;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const RepairModal = ({ selectedItem, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);

  const [rejectionReason, setRejectionReason] = useState("");

  const [patchDetails, setPatchDetails] = useState<PatchDetail[]>([]);

  const [newPatch, setNewPatch] = useState<PatchDetail>({
    repairLocation: "",
    damageType: "",
    repairMaterial: "",
    patchSize: "",
  });

  const [locations, setLocations] = useState<any[]>([]);

  const [damageTypes, setDamageTypes] = useState<any[]>([]);

  const [repairMaterials, setRepairMaterials] = useState<any[]>([]);

  const [patchSizes, setPatchSizes] = useState<any[]>([]);

  const loadLocations = async () => {
    try {
      const result = await repairService.getRepairLocations();

      setLocations(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDamageTypes = async () => {
    try {
      const result = await repairService.getDamageTypes();

      setDamageTypes(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRepairMaterials = async () => {
    try {
      const result = await repairService.getRepairMaterials();

      setRepairMaterials(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatchSizes = async (repairMaterialId: number) => {
    try {
      const result = await repairService.getPatchSizes(repairMaterialId);

      setPatchSizes(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRejectionReasons();

    loadLocations();

    loadDamageTypes();

    loadRepairMaterials();
  }, []);

  const loadRejectionReasons = async () => {
    try {
      const result = await repairService.getRejectionReasons();

      setRejectionReasons(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addPatch = () => {
    if (
      !newPatch.repairLocation ||
      !newPatch.damageType ||
      !newPatch.repairMaterial ||
      !newPatch.patchSize
    ) {
      alert("Please select all fields");
      return;
    }

    setPatchDetails((prev) => [...prev, newPatch]);

    setNewPatch({
      repairLocation: "",
      damageType: "",
      repairMaterial: "",
      patchSize: "",
    });
  };

  const removePatch = (index: number) => {
    setPatchDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isApproved: boolean) => {
    try {
      if (!isApproved && !rejectionReason) {
        alert("Please select rejection reason");
        return;
      }
      setLoading(true);

      const inspectionRows = selectedItem?.repairDetail?.length || 0;

      const patchRows = patchDetails.length;

      if (isApproved && inspectionRows !== patchRows) {
        alert(
          `Patch Details count (${patchRows}) must be equal to Inspection/Skiving records (${inspectionRows}).`,
        );

        return;
      }

      const payload = {
        orderCasingIds: [String(selectedItem.orderCasingId ?? selectedItem.id)],

        isApproved,

        rejectionReasonCode: isApproved ? null : rejectionReason,

        patchDetails,
      };
      console.log("payload Repair", payload);
      await repairService.approveReject(payload);

      alert(isApproved ? "Approved Successfully" : "Rejected Successfully");

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      alert("The Number of Expected Patch Details is not provided.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}

      <div className="modal-backdrop fade show"></div>

      <div
        className="modal d-block"
        style={{
          zIndex: 1055,
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header bg-danger text-white d-flex justify-content-between align-items-center">
              <h4 className="modal-title mb-0">REPAIR STAGE – APPROVAL</h4>

              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div>John Doe</div>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={onClose}
                />
              </div>
            </div>

            <div className="modal-body p-0 m-0" style={{ overflowX: "hidden" }}>
              {/* TOP INFO */}

              <div className="modal-info p-1 repairs-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>

                  <div>{selectedItem?.productionNumber}</div>
                </div>

                <div className="col">
                  <strong>Tyre Ref No</strong>

                  <div>{selectedItem?.tyreReferenceNumber}</div>
                </div>

                <div className="col-2">
                  <strong>Customer Name</strong>

                  <div>{selectedItem?.customerName}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>

                  <div>{selectedItem?.tyreSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>

                  <div>{selectedItem?.requestedPattern}</div>
                </div>
                <div className="col">
                  <strong>ReApproved Pattern</strong>
                  <div>{selectedItem?.reApprovedPattern || "-"}</div>
                </div>
              </div>

              <div className="repair-bg m-1">
                <div className="repair-box mx-auto">
                  <div className="side-panel">
                    {/* TAB */}

                    <div className="row align-items-center mb-1">
                      <div className="col-md-5 repair-details-btn">
                        <button className="repair-tab-btn active">
                          Repair Details
                        </button>
                      </div>

                      <div className="col-md-7">
                        <div className="repair-header">
                          <span>Repair Details - Patches</span>

                          <span>
                            Total Found : {selectedItem.repairDetail.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* INSPECTION TABLE */}

                    <div className="panel-section mb-2">
                      <div className="section-title">
                        Inspection Stage & Skiving Stage
                      </div>

                      <div className="table-responsive">
                        <table className="table table-bordered align-middle mb-0 compact-table">
                          <thead>
                            <tr className="bg-new">
                              <th>Sr. No.</th>
                              <th>Reason For Removal</th>

                              <th>Damage Type</th>

                              <th>Repair Location</th>

                              <th>Found At Location</th>
                            </tr>
                          </thead>

                          <tbody>
                            {selectedItem?.repairDetail?.length > 0 ? (
                              selectedItem.repairDetail.map(
                                (item: any, index: number) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.reasonForRemoval}</td>

                                    <td>{item.damageType}</td>

                                    <td>{item.repairLocation}</td>

                                    <td>{item.foundAt}</td>
                                  </tr>
                                ),
                              )
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center">
                                  No repair details found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* LEFT */}

                      <div className="col-md-8">
                        <div className="form-panel">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label>Location</label>

                              <select
                                className="form-select"
                                value={newPatch.repairLocation}
                                onChange={(e) =>
                                  setNewPatch({
                                    ...newPatch,
                                    repairLocation: e.target.value,
                                  })
                                }
                              >
                                <option value="">--- Location ---</option>

                                {locations.map((item) => (
                                  <option key={item.id} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label>Damage Type</label>

                              <select
                                className="form-select"
                                value={newPatch.damageType}
                                onChange={(e) =>
                                  setNewPatch({
                                    ...newPatch,
                                    damageType: e.target.value,
                                  })
                                }
                              >
                                <option value="">--- Damage Type ---</option>

                                {damageTypes.map((item) => (
                                  <option key={item.id} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label>Repair Material</label>

                              <select
                                className="form-select"
                                value={newPatch.repairMaterial}
                                onChange={async (e) => {
                                  const selectedMaterial = repairMaterials.find(
                                    (x) => x.name === e.target.value,
                                  );

                                  setNewPatch({
                                    ...newPatch,
                                    repairMaterial: e.target.value,
                                    patchSize: "",
                                  });

                                  if (selectedMaterial) {
                                    await loadPatchSizes(selectedMaterial.id);
                                  }
                                }}
                              >
                                <option value="">
                                  --- Repair Material ---
                                </option>

                                {repairMaterials.map((item) => (
                                  <option key={item.id} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label>Patch Size</label>

                              <select
                                className="form-select"
                                value={newPatch.patchSize}
                                onChange={(e) =>
                                  setNewPatch({
                                    ...newPatch,
                                    patchSize: e.target.value,
                                  })
                                }
                              >
                                <option value="">--- Patch Size ---</option>

                                {patchSizes.map((item) => (
                                  <option
                                    key={item.patchSizeId}
                                    value={item.displayName}
                                  >
                                    {item.displayName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary add-btn mt-2 mb-1"
                            onClick={addPatch}
                          >
                            Add Patch Details
                          </button>

                          <div className="table-panel mt-2">
                            <table className="table table-bordered text-center align-middle mb-0 compact-table">
                              <thead>
                                <tr className="bg-new">
                                  <th>Patch #</th>
                                  <th>Location</th>
                                  <th>Repair Material</th>
                                  <th>Patch Size</th>
                                  <th>Damage Type</th>
                                  <th>Remove</th>
                                </tr>
                              </thead>

                              <tbody>
                                {patchDetails.length === 0 ? (
                                  <tr>
                                    <td colSpan={6}>No repair patches added</td>
                                  </tr>
                                ) : (
                                  patchDetails.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>

                                      <td>{item.repairLocation}</td>

                                      <td>{item.repairMaterial}</td>

                                      <td>{item.patchSize}</td>

                                      <td>{item.damageType}</td>

                                      <td>
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removePatch(index)}
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div className="col-md-4">
                        <div className="form-panel h-100 d-flex flex-column justify-content-between">
                          <div>
                            <label className="fw-semibold">
                              Rejection Reason
                            </label>

                            <select
                              className="form-select mt-1"
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                            >
                              <option value="">--- Select Reason ---</option>

                              {rejectionReasons.map((item) => (
                                <option
                                  key={item.rejectionReasonId}
                                  value={item.code}
                                >
                                  {item.reason}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-3 d-grid gap-2">
                            <button
                              className="btn btn-reject btn-sm-action"
                              onClick={() => handleSubmit(false)}
                            >
                              REJECTED
                            </button>

                            <button
                              className="btn btn-approve btn-sm-action"
                              onClick={() => handleSubmit(true)}
                            >
                              APPROVED
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepairModal;
