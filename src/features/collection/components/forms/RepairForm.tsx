// src/features/collection/components/forms/RepairForm.tsx

import type {
  Category,
  TyreHistory,
  TyreMake,
  TyreSize,
  RimSize,
} from "../../types/collection.types";

type Repair = {
  id: number;
  repairType: string;
  repairLocation: string;
  repairQty: string;
};

type Props = {
  // ================= DATA =================
  selectedRimSize: string;

  setSelectedRimSize: (value: string) => void;

  tyreSize: string;

  setTyreSize: (value: string) => void;

  tyreSizes: TyreSize[];

  rimSizes: RimSize[];

  selectedTyreName: string;

  setSelectedTyreName: (value: string) => void;

  // ================= MAKE =================
  selectedMake: string | null;

  setSelectedMake: (value: string | null) => void;

  filteredMake: TyreMake[];

  search: string;

  setSearch: (value: string) => void;

  showDropdown: boolean;

  setShowDropdown: (value: boolean) => void;

  setTyreClass: (value: string) => void;

  setTyreMakeId: (value: number) => void;

  tyreClassificationId: number;

  setTyreClassificationId: (value: number) => void;

  // ================= MODEL =================
  model: string;

  setModel: (value: string) => void;

  tyreClass: string;

  // ================= SERIAL =================
  serial: string;

  setSerial: (value: string) => void;

  dot: string;

  setDot: (value: string) => void;

  otherNumber: string;

  setOtherNumber: (value: string) => void;

  vehicleReg: string;

  setVehicleReg: (value: string) => void;

  noOfRepairs: string;

  setNoOfRepairs: (value: string) => void;

  // ================= RETREAD =================
  isRetreaded: boolean;

  handleIsRetreadedChange: (checked: boolean) => void;

  noOfRetreads: string;

  setNoOfRetreads: (value: string) => void;

  previousPattern: string;

  setPreviousPattern: (value: string) => void;

  retreadRef: string;

  setRetreadRef: (value: string) => void;

  // ================= TYRE HISTORY =================
  showTyreHistory: boolean;

  setShowTyreHistory: (value: boolean) => void;

  tyreHistoryList: TyreHistory[];

  // ================= REPAIR =================
  repairType: string;

  setRepairType: (value: string) => void;

  repairLocation: string;

  setRepairLocation: (value: string) => void;

  repairQty: string;

  setRepairQty: (value: string) => void;

  repairs: Repair[];

  handleAddRepair: () => void;

  handleDeleteRepair: (id: number) => void;

  remainingTreadDepth: string;

  setRemainingTreadDepth: (value: string) => void;

  remarks: string;

  setRemarks: (value: string) => void;

  // ================= COMMON =================
  category: Category | null;

  handleAddCasing: () => void;

  isEditMode?: boolean;
};

const RepairForm = ({
  // ================= DATA =================
  selectedRimSize,
  setSelectedRimSize,

  tyreSize,
  setTyreSize,

  tyreSizes = [],
  rimSizes = [],

  setSelectedTyreName,

  // ================= MAKE =================
  selectedMake,
  setSelectedMake,

  filteredMake = [],

  search,
  setSearch,

  showDropdown,
  setShowDropdown,

  setTyreClass,
  setTyreMakeId,

  setTyreClassificationId,

  // ================= MODEL =================
  model,
  setModel,

  tyreClass,

  // ================= SERIAL =================
  serial,
  setSerial,

  dot,
  setDot,

  otherNumber,
  setOtherNumber,

  vehicleReg,
  setVehicleReg,

  noOfRepairs,
  setNoOfRepairs,

  // ================= RETREAD =================
  isRetreaded,
  handleIsRetreadedChange,

  noOfRetreads,
  setNoOfRetreads,

  previousPattern,
  setPreviousPattern,

  retreadRef,
  setRetreadRef,

  // ================= TYRE HISTORY =================
  showTyreHistory,
  setShowTyreHistory,

  tyreHistoryList = [],

  // ================= REPAIR =================
  repairType,
  setRepairType,

  repairLocation,
  setRepairLocation,

  repairQty,
  setRepairQty,

  repairs = [],

  handleAddRepair,
  handleDeleteRepair,

  remainingTreadDepth,
  setRemainingTreadDepth,

  remarks,
  setRemarks,

  // ================= COMMON =================
  category,

  handleAddCasing,

  isEditMode = false,
}: Props) => {
  return (
    <div className="truck-repair-form">
      {/* SERVICE BAR */}
      <div className="service-bar">
        Service Type – <b>REPAIR</b>
      </div>

      {/* ================= ROW 1 ================= */}
      <div className="row g-3 mt-2">
        {/* RIM SIZE */}
        <div className="col-md-3">
          <label className="form-label">Rim Size</label>

          <select
            className="form-select modern-input"
            value={selectedRimSize}
            onChange={(e) => setSelectedRimSize(e.target.value)}
            disabled={!category}
          >
            <option value="">-- Select Rim Size --</option>

            {rimSizes.map((r) => (
              <option key={r.rimSize} value={r.rimSize}>
                {r.rimSize}
              </option>
            ))}
          </select>
        </div>

        {/* TYRE SIZE */}
        <div className="col-md-3">
          <label className="form-label">Tyre Size</label>

          <select
            className="form-select modern-input"
            value={tyreSize || ""}
            onChange={(e) => {
              const selected = tyreSizes.find(
                (t) => String(t.id) === String(e.target.value),
              );

              console.log("Selected Tyre Object:", selected);

              // STORE ID
              setTyreSize(String(selected?.id || ""));

              // STORE DISPLAY NAME
              setSelectedTyreName(selected?.casingSize || "");
            }}
            disabled={!selectedRimSize}
          >
            <option value="">-- Select Tyre Size --</option>

            {tyreSizes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.casingSize}
              </option>
            ))}
          </select>
        </div>

        {/* MAKE */}
        <div className="col-md-3">
          <label className="form-label">Make</label>

          <div className="custom-dropdown">
            <div
              className="dropdown-input"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedMake || "-- Select Tyre Make --"}

              <span className="dropdown-arrow">▼</span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu-custom">
                <input
                  type="text"
                  className="dropdown-search"
                  placeholder="Search Make..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="dropdown-list">
                  {filteredMake.map((m) => (
                    <div
                      key={m.tyreMakeId}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedMake(m.tyreMakeName);

                        setTyreClass(m.tyreClassificationName);

                        setTyreMakeId(m.tyreMakeId);

                        setTyreClassificationId(m.tyreClassificationId);

                        setShowDropdown(false);

                        setSearch("");
                      }}
                    >
                      {m.tyreMakeName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODEL */}
        <div className="col-md-3">
          <label className="form-label">Model</label>

          <input
            type="text"
            className="form-control modern-input"
            list="modelList"
            placeholder="Select or type Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <datalist id="modelList">
            <option value="XDA2" />
            <option value="G528" />
            <option value="E100" />
          </datalist>
        </div>
      </div>

      {/* ================= ROW 2 ================= */}
      <div className="row g-3 mt-2">
        {/* TYRE CLASSIFICATION */}
        <div className="col-md-3">
          <label className="form-label">Tyre Classification</label>

          <input
            type="text"
            className="form-control modern-input"
            value={tyreClass}
            readOnly
            disabled={!selectedMake}
          />
        </div>

        {/* TYRE REF */}
        <div className="col-md-3">
          <label className="form-label">
            TYRE REF. NUMBER <span className="text-danger">*</span>
          </label>

          <input
            className="form-control modern-input"
            placeholder="Tyre Ref No#"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>

        {/* DOT */}
        <div className="col-md-3">
          <label className="form-label">
            DOT No# <span className="text-danger">*</span>
          </label>

          <input
            className="form-control modern-input"
            placeholder="Tyre DOT No#"
            value={dot}
            onChange={(e) => setDot(e.target.value)}
          />
        </div>

        {/* VEHICLE REG */}
        <div className="col-md-3">
          <label className="form-label">Customer Vehicle Reg No#</label>

          <input
            className="form-control modern-input"
            placeholder="Optional"
            value={vehicleReg}
            onChange={(e) => setVehicleReg(e.target.value)}
          />
        </div>

        {/* OTHER NUMBER */}
        <div className="col-md-3">
          <label className="form-label">OTHER NUMBER</label>

          <input
            className="form-control modern-input"
            placeholder="Optional"
            value={otherNumber}
            onChange={(e) => setOtherNumber(e.target.value)}
          />
        </div>

        {/* EXISTING REPAIRS */}
        <div className="col-md-3">
          <label className="form-label">No of Existing Repairs</label>

          <input
            type="number"
            className="form-control modern-input"
            placeholder="No of existing repairs"
            value={noOfRepairs}
            onChange={(e) => setNoOfRepairs(e.target.value)}
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* TYRE HISTORY */}
      <div className="row g-2 mt-2 align-items-end">
        <div className="col-md-1">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowTyreHistory(true)}
          >
            Tyre History
          </button>
        </div>

        {showTyreHistory && (
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div
                className="modal-content"
                style={{
                  marginTop: "100px",
                }}
              >
                <div className="modal-header custom-header">
                  <h5 className="modal-title">Previous Retread</h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowTyreHistory(false)}
                  />
                </div>

                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Invoice Date</th>
                          <th>Invoice No</th>
                          <th>Invoice Amount</th>
                          <th>Previous Pattern</th>
                          <th>Repair Material</th>
                          <th>Service Type</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tyreHistoryList.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>

                            <td>{item.invoiceDate}</td>

                            <td>{item.invoiceNo}</td>

                            <td>₹{item.invoiceAmount}</td>

                            <td>{item.previousPattern}</td>

                            <td>{item.repairMaterial}</td>

                            <td>{item.serviceType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowTyreHistory(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* IS RETREADED */}
      <div className="row g-2 mt-2 align-items-end">
        {/* CHECKBOX */}
        <div className="col-md-3 d-flex">
          <input
            type="checkbox"
            checked={isRetreaded}
            onChange={(e) => handleIsRetreadedChange(e.target.checked)}
            className="me-2"
          />
          <label className="form-label d-block mt-2">Is Retreaded</label>
        </div>

        {/* NO OF RETREADS */}
        <div className="col-md-3">
          {isRetreaded && (
            <>
              <label className="form-label">No of Retreads</label>

              <input
                type="number"
                className="form-control modern-input"
                value={noOfRetreads}
                onChange={(e) => setNoOfRetreads(e.target.value)}
              />
            </>
          )}
        </div>

        {/* PREVIOUS PATTERN */}
        <div className="col-md-3">
          {isRetreaded && (
            <>
              <label className="form-label">Previous Pattern</label>

              <input
                type="text"
                className="form-control modern-input"
                value={previousPattern}
                onChange={(e) => setPreviousPattern(e.target.value)}
              />
            </>
          )}
        </div>

        {/* PREVIOUS RETREADER */}
        <div className="col-md-3">
          {isRetreaded && (
            <>
              <label className="form-label">Previous Retreader</label>

              <input
                type="text"
                className="form-control modern-input"
                value={retreadRef}
                onChange={(e) => setRetreadRef(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* REPAIR SECTION */}
      <div className="row g-3 mt-1">
        {/* DAMAGE TYPE */}
        <div className="col-md-4">
          <label className="form-label">Damage Type</label>

          <select
            className="form-select modern-input"
            value={repairType}
            onChange={(e) => setRepairType(e.target.value)}
          >
            <option value="">-- Select Repair --</option>

            <option>Puncture</option>

            <option>Side Wall Cut</option>

            <option>Bead Damage</option>

            <option>Tread Cut</option>
          </select>
        </div>

        {/* REPAIR LOCATION */}
        <div className="col-md-4">
          <label className="form-label">Repair Location</label>

          <select
            className="form-select modern-input"
            value={repairLocation}
            onChange={(e) => setRepairLocation(e.target.value)}
          >
            <option value="">-- Select Location --</option>

            <option>Side Wall</option>

            <option>Tread</option>

            <option>Shoulder</option>
          </select>
        </div>

        {/* QTY */}
        <div className="col-md-4">
          <label className="form-label">Repair Qty</label>

          <input
            type="number"
            min="1"
            className="form-control modern-input"
            value={repairQty}
            onChange={(e) => setRepairQty(e.target.value)}
          />
        </div>
      </div>

      {/* ADD REPAIR BUTTON */}
      <div className="mt-2 text-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddRepair}
        >
          Add Repair
        </button>
      </div>

      {/* REPAIR TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Damage Type</th>
              <th>Repair Location</th>
              <th>Qty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {repairs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No repairs added
                </td>
              </tr>
            ) : (
              repairs.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>

                  <td>{r.repairType}</td>

                  <td>{r.repairLocation}</td>

                  <td>{r.repairQty}</td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteRepair(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DIVIDER */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* TREAD DEPTH */}
      <div className="row g-3 mt-2">
        {/* TREAD DEPTH */}
        <div className="col-md-4">
          <label className="form-label">Percentage Remaining Tread Depth</label>

          <input
            type="number"
            className="form-control modern-input"
            placeholder="Enter tread depth in %"
            value={remainingTreadDepth}
            onChange={(e) => setRemainingTreadDepth(e.target.value)}
          />
        </div>

        {/* REMARKS */}
        <div className="col-md-4">
          <label className="form-label">Remarks</label>

          <textarea
            className="form-control modern-input"
            rows={2}
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer-actions">
        <div></div>

        {!isEditMode && (
          <button className="btn btn-primary btn-sm" onClick={handleAddCasing}>
            Add Casing to Order
          </button>
        )}
      </div>
    </div>
  );
};

export default RepairForm;
