// src/features/collection/components/forms/ClaimForm.tsx

import type {
  Category,
  RimSize,
  TyreHistory,
  TyreMake,
  TyreSize,
} from "../../types/collection.types";

type Props = {
  // ================= DATA =================
  selectedRimSize: string;

  setSelectedRimSize: (value: string) => void;

  tyreSize: string | number;

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

  // ================= TYRE HISTORY =================
  showTyreHistory: boolean;

  setShowTyreHistory: (value: boolean) => void;

  tyreHistoryList: TyreHistory[];

  // ================= CLAIM =================
  images: File[];

  setImages: React.Dispatch<React.SetStateAction<File[]>>;

  showPreview: boolean;

  setShowPreview: (value: boolean) => void;

  selectedImage: File | null;

  setSelectedImage: (value: File | null) => void;

  patternMismatch: boolean;

  setPatternMismatch: (value: boolean) => void;

  showRejectMessage: boolean;

  setShowRejectMessage: (value: boolean) => void;
  factoryCode: string;
  setFactoryCode: React.Dispatch<React.SetStateAction<string>>;

  manufacturingWeek: string;
  setManufacturingWeek: React.Dispatch<React.SetStateAction<string>>;

  manufacturingYear: string;
  setManufacturingYear: React.Dispatch<React.SetStateAction<string>>;

  // ================= COMMON =================
  category: Category | null;

  handleAddCasing: () => void;

  isEditMode?: boolean;
  onSave?: () => void;
  onClose?: () => void;
};

const ClaimForm = ({
  onSave,
  onClose,
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

  // ================= TYRE HISTORY =================
  showTyreHistory,
  setShowTyreHistory,

  tyreHistoryList = [],

  // ================= CLAIM =================
  images,
  setImages,

  showPreview,
  setShowPreview,

  selectedImage,
  setSelectedImage,

  patternMismatch,
  setPatternMismatch,

  showRejectMessage,
  setShowRejectMessage,
  factoryCode,
  setFactoryCode,
  manufacturingWeek,
  manufacturingYear,
  setManufacturingWeek,
  setManufacturingYear,

  // ================= COMMON =================
  category,

  handleAddCasing,

  isEditMode = false,
}: Props) => {
  return (
    <div className="truck-claims-form">
      {/* SERVICE BAR */}
      <div className="service-bar">
        Service Type – <b>CLAIMS</b>
      </div>

      {/* ================= ROW 1 ================= */}
      <div className="row g-3 mt-2">
        {/* CLAIM TYPE */}
        <div className="col-md-3">
          <label className="form-label">Claim Type</label>

          <select className="form-select modern-input" defaultValue="">
            <option value="" disabled>
              Select Claim Type
            </option>

            <option value="Retread">Retread</option>

            <option value="Repair">Repair</option>

            <option value="Stock Casing">Stock Casing</option>
          </select>
        </div>

        {/* CATEGORY */}
        <div className="col-md-3">
          <label className="form-label">Category</label>

          <input
            type="text"
            className="form-control modern-input"
            value={category?.categoryName || ""}
            readOnly
          />
        </div>

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
      </div>

      {/* ================= ROW 2 ================= */}
      <div className="row g-3 mt-2">
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
      </div>

      {/* ================= ROW 3 ================= */}
      <div className="row g-3 mt-2">
        {/* DOT */}
        {/* <div className="col-md-3">
          <label className="form-label">
            DOT No# <span className="text-danger">*</span>
          </label>

          <input
            className="form-control modern-input"
            placeholder="Tyre DOT No#"
            value={dot}
            onChange={(e) => setDot(e.target.value)}
          />
        </div> */}
        <div className="col-md-3">
          <label className="form-label">
            DOT No <span className="text-danger">*</span>
          </label>
          <div className="d-flex gap-2">
            {/* Factory Code */}
            <input
              type="text"
              className="form-control text-center"
              style={{ width: "80px", height: "37px" }}
              maxLength={3}
              placeholder="ABC"
              value={factoryCode}
              onChange={(e) => {
                const value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");

                setFactoryCode(value);
              }}
            />

            {/* Manufacturing Week */}
            <input
              type="text"
              className="form-control text-center"
              style={{ width: "70px", height: "37px" }}
              maxLength={2}
              placeholder="WW"
              value={manufacturingWeek}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                if (value === "") {
                  setManufacturingWeek("");
                  return;
                }

                if (Number(value) > 52) return;

                setManufacturingWeek(value);
              }}
              onBlur={() => {
                if (manufacturingWeek.length === 1) {
                  setManufacturingWeek(manufacturingWeek.padStart(2, "0"));
                }
              }}
            />

            {/* Manufacturing Year */}
            <input
              type="text"
              className="form-control text-center"
              style={{ width: "70px", height: "37px" }}
              maxLength={2}
              placeholder="YY"
              value={manufacturingYear}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                if (value === "") {
                  setManufacturingYear("");
                  return;
                }

                const currentYear = new Date().getFullYear() % 100;

                if (Number(value) > currentYear) return;

                setManufacturingYear(value);
              }}
              onBlur={() => {
                if (manufacturingYear.length === 1) {
                  setManufacturingYear(manufacturingYear.padStart(2, "0"));
                }
              }}
            />
          </div>
        </div>

        {/* OTHER NUMBER */}
        <div className="col-md-3">
          <label className="form-label">Other Number</label>

          <input
            className="form-control modern-input"
            placeholder="Optional"
            value={otherNumber}
            onChange={(e) => setOtherNumber(e.target.value)}
          />
        </div>

        {/* CURRENT PATTERN */}
        <div className="col-md-3">
          <label className="form-label">Current Pattern</label>

          <select className="form-select modern-input">
            <option>-- Select Value --</option>

            <option value="A100">A100</option>

            <option value="A102">A102</option>

            <option value="A103">A103</option>
          </select>
        </div>

        {/* ORIGINAL TREAD */}
        <div className="col-md-3">
          <label className="form-label">Original Tread Depth (mm)</label>

          <input
            type="number"
            min={1}
            className="form-control modern-input"
            placeholder="Tread Depth in mm"
            // value={treadDepth}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || Number(value) >= 1) {
                // setTreadDepth(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>

      {/* ================= ROW 4 ================= */}
      <div className="row g-3 mt-2">
        {/* REMAINING TREAD */}
        <div className="col-md-3">
          <label className="form-label">Remaining Tread Depth (mm)</label>

          <input
            type="number"
            min={1}
            className="form-control modern-input"
            placeholder="Tread Depth in mm"
            // value={treadDepth}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || Number(value) >= 1) {
                // setTreadDepth(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* IMAGE */}
        <div className="col-md-3">
          <label className="form-label">Upload Picture</label>

          <input
            type="file"
            className="form-control modern-input"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);

              setImages((prev) => [...prev, ...files]);
            }}
          />

          {images.length > 0 && (
            <div className="d-flex align-items-center gap-3 mt-1">
              <small className="text-muted">
                Total Images: <strong>{images.length}</strong>
              </small>

              <button
                type="button"
                className="btn btn-sm btn-link p-0"
                onClick={() => setShowPreview(true)}
              >
                Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* ================= TYRE HISTORY ================= */}
      <div className="row g-3 mt-2">
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowTyreHistory(true)}
          >
            Tyre History
          </button>
        </div>

        {/* TYRE HISTORY MODAL */}
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

        {/* RETREAD COUNT */}
        <div className="col-md-4">
          <input
            type="number"
            className="form-control modern-input"
            placeholder="No of retreads"
          />
        </div>

        {/* REPAIR COUNT */}
        <div className="col-md-4">
          <input
            type="number"
            className="form-control modern-input"
            placeholder="No of existing repairs"
          />
        </div>
      </div>

      {/* ================= PATTERN MISMATCH ================= */}
      <div className="row g-2 mt-2 align-items-end">
        <div className="col-md-4 d-flex">
          <input
            type="checkbox"
            checked={patternMismatch}
            onChange={(e) => {
              setPatternMismatch(e.target.checked);

              setShowRejectMessage(false);
            }}
            className="me-2"
          />
          <label className="form-label d-block mt-2">
            Pattern Does Not Match
          </label>
        </div>

        {patternMismatch && (
          <>
            <div className="col-md-4">
              <label className="form-label">Rejected Pattern No</label>

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Enter Rejected Pattern No"
              />
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-danger"
                onClick={() => setShowRejectMessage(true)}
              >
                Rejected
              </button>
            </div>
          </>
        )}
      </div>

      {/* REJECT ALERT */}
      {showRejectMessage && (
        <div className="alert alert-danger mt-2">Pattern does not match.</div>
      )}

      {/* DIVIDER */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* ================= CLAIM ANALYSIS ================= */}
      {!patternMismatch && (
        <>
          <div className="pattern-header mt-4">Claim Tyre Analysis</div>

          {/* PREVIEW MODAL */}
          {showPreview && (
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div
                  className="modal-content"
                  style={{
                    marginTop: "130px",
                  }}
                >
                  <div className="modal-header custom-header">
                    <h5 className="modal-title">
                      Uploaded Images ({images.length})
                    </h5>

                    <button
                      className="btn-close"
                      onClick={() => setShowPreview(false)}
                    />
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      {images.map((img, index) => (
                        <div className="col-md-4" key={index}>
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`preview-${index}`}
                            className="img-fluid rounded border"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => setSelectedImage(img)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FULL IMAGE MODAL */}
          {selectedImage && (
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Image Preview</h5>

                    <button
                      className="btn-close"
                      onClick={() => setSelectedImage(null)}
                    />
                  </div>

                  <div className="modal-body text-center">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="full-preview"
                      className="img-fluid"
                      style={{
                        maxHeight: "80vh",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYSIS FIELDS */}
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <label className="form-label">Customer Vehicle Reg No.</label>

              <input
                className="form-control modern-input"
                placeholder="Optional"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Driver Name</label>

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Enter Driver Name"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Mileage (KM)</label>

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Enter Mileage"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Incident Location</label>

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Enter incident location"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Axle Position Fitted During Failure
              </label>

              <select className="form-select modern-input">
                <option value="">-- Select Axle Position --</option>

                <option value="Single Fitment (Side Unknown)">
                  Single Fitment (Side Unknown)
                </option>

                <option value="Single Fitment Left">Single Fitment Left</option>

                <option value="Single Fitment Right">
                  Single Fitment Right
                </option>

                <option value="Twin Fitment (Inside Left)">
                  Twin Fitment (Inside Left)
                </option>

                <option value="Twin Fitment (Inside Right)">
                  Twin Fitment (Inside Right)
                </option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Production (MM / YY)</label>

              <input
                type="text"
                className="form-control modern-input"
                placeholder="MM / YY"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Manifestation</label>

              <select className="form-select modern-input">
                <option value="">-- Select Manifestation --</option>

                <option>Side Wall Cut</option>

                <option>Tread Separation</option>

                <option>Bead Failure</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Suggested Action</label>

              <select className="form-select modern-input">
                <option value="">-- Select Action --</option>

                <option>Replace Tyre</option>

                <option>Retread</option>

                <option>Repair</option>

                <option>Reject Claim</option>

                <option>Inspection Required</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>

              <select className="form-select modern-input">
                <option value="">-- Select Status --</option>

                <option>Under Review</option>

                <option>Approved</option>

                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* REMARKS */}
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <label className="form-label">Remarks</label>

              <textarea
                className="form-control modern-input"
                rows={2}
                placeholder="Describe the issue"
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="col-12">
            <hr className="mt-2 mb-0" />
          </div>

          {/* FOOTER */}
          <div className="footer-actions">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSave}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <div
                className="mx-10 d-flex justify-content-end"
                style={{ marginLeft: "70.3rem" }}
              >
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddCasing}
                >
                  Add Casing to Order
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClaimForm;
