// src/features/collection/components/forms/RetreadForm.tsx

import React from "react";
import { useState } from "react";
import type {
  Pattern,
  PatternVariant,
  RimSize,
  TyreHistory,
  TyreSize,
  Category,
} from "../../types/collection.types";

import "../../styles/Collection.css";
interface TyreMake {
  tyreMakeId: number;
  tyreMakeName: string;
  tyreClassificationId: number;
  tyreClassificationName: string;
}

interface RetreadFormProps {
  // ================= DATA =================
  handleMakeSelect: (m: TyreMake) => void;

  selectedRimSize: string;
  setSelectedRimSize: React.Dispatch<React.SetStateAction<string>>;

  tyreSizes: TyreSize[];
  setTyreSize: React.Dispatch<React.SetStateAction<any>>;
  tyreSize: string | number;

  rimSizes: RimSize[];

  selectedTyreName: string;
  setSelectedTyreName: React.Dispatch<React.SetStateAction<string>>;

  // ================= MAKE =================
  selectedMake: string | null;
  setSelectedMake: React.Dispatch<React.SetStateAction<string | null>>;

  make: TyreMake[];

  filteredMake: TyreMake[];

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;

  setTyreClass: React.Dispatch<React.SetStateAction<string>>;

  setTyreMakeId: React.Dispatch<React.SetStateAction<number>>;

  tyreClassificationId: number;

  setTyreClassificationId: React.Dispatch<React.SetStateAction<number>>;

  // ================= MODEL =================
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;

  tyreClass: string;

  // ================= SERIAL =================
  serial: string;
  setSerial: React.Dispatch<React.SetStateAction<string>>;

  dot: string;
  setDot: React.Dispatch<React.SetStateAction<string>>;

  otherNumber: string;
  setOtherNumber: React.Dispatch<React.SetStateAction<string>>;

  vehicleReg: string;
  setVehicleReg: React.Dispatch<React.SetStateAction<string>>;

  noOfRepairs: string;
  setNoOfRepairs: React.Dispatch<React.SetStateAction<string>>;

  // ================= RETREAD =================
  isRetreaded: boolean;

  handleIsRetreadedChange: (checked: boolean) => void;

  noOfRetreads: string;
  setNoOfRetreads: React.Dispatch<React.SetStateAction<string>>;

  previousPattern: string;
  setPreviousPattern: React.Dispatch<React.SetStateAction<string>>;

  retreadRef: string;
  setRetreadRef: React.Dispatch<React.SetStateAction<string>>;

  // ================= TYRE HISTORY =================
  showTyreHistory: boolean;

  setShowTyreHistory: React.Dispatch<React.SetStateAction<boolean>>;

  tyreHistoryList: TyreHistory[];

  // ================= PATTERN =================
  override: boolean;

  setOverride: React.Dispatch<React.SetStateAction<boolean>>;

  handleOverrideChange: (checked: boolean) => void;

  selectedPattern: string;

  handlePatternChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  patterns: Pattern[];

  selectedWidth: string;

  setSelectedWidth: React.Dispatch<React.SetStateAction<string>>;

  widths: number[];

  selectedPatternObj: Pattern | null;

  setSelectedVariantId: React.Dispatch<React.SetStateAction<any>>;

  brand: string;
  patternClass: string;
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
}

const RetreadForm: React.FC<RetreadFormProps> = ({
  onSave,
  onClose,
  handleMakeSelect,
  selectedRimSize,
  setSelectedRimSize,

  tyreSizes,
  setTyreSize,
  tyreSize,
  rimSizes,

  selectedTyreName,
  setSelectedTyreName,

  selectedMake,
  setSelectedMake,

  make,
  filteredMake,

  search,
  setSearch,

  showDropdown,
  setShowDropdown,

  setTyreClass,
  setTyreMakeId,
  tyreClassificationId,
  setTyreClassificationId,

  model,
  setModel,

  tyreClass,

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

  isRetreaded,
  handleIsRetreadedChange,

  noOfRetreads,
  setNoOfRetreads,

  previousPattern,
  setPreviousPattern,

  retreadRef,
  setRetreadRef,

  showTyreHistory,
  setShowTyreHistory,

  tyreHistoryList,

  override,
  setOverride,
  handleOverrideChange,

  selectedPattern,
  handlePatternChange,

  patterns,

  selectedWidth,
  setSelectedWidth,

  widths,

  selectedPatternObj,
  setSelectedVariantId,

  brand,
  patternClass,

  category,

  handleAddCasing,
  isEditMode = false,
  factoryCode,
  setFactoryCode,
  manufacturingWeek,
  manufacturingYear,
  setManufacturingWeek,
  setManufacturingYear,
}) => {
  return (
    <div className="truck-retread-form">
      {/* SERVICE TYPE LABEL */}
      <div className="service-bar">
        Service Type – <b>RETREAD</b>
      </div>

      {/* ROW 1 */}
      <div className="row g-3 mt-2">
        {/* Rim Size */}
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

        {/* Tyre Size */}
        <div className="col-md-3">
          <label className="form-label">Tyre Size</label>

          <select
            className="form-select modern-input"
            value={tyreSize}
            onChange={(e) => {
              const selected = tyreSizes.find(
                (t) => String(t.id) === e.target.value,
              );

              console.log("Selected Tyre Object:", selected);

              setTyreSize(e.target.value);

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
                        handleMakeSelect(m);

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

        {/* Model */}
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

      {/* ROW 2 */}
      <div className="row g-3 mt-2">
        {/* Tyre Classification */}
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

        {/* Tyre Ref Number */}
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
        {/* DOT */}
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

        {/* Other Number */}
        <div className="col-md-3">
          <label className="form-label">OTHER NUMBER</label>

          <input
            className="form-control modern-input"
            placeholder="Optional"
            value={otherNumber}
            onChange={(e) => setOtherNumber(e.target.value)}
          />
        </div>

        {/* Vehicle Reg */}
        <div className="col-md-3">
          <label className="form-label">Customer Vehicle Reg No#</label>

          <input
            className="form-control modern-input"
            placeholder="Optional"
            value={vehicleReg}
            onChange={(e) => setVehicleReg(e.target.value)}
          />
        </div>

        {/* Existing Repairs */}
        <div className="col-md-3">
          <label className="form-label">No. of Existing Repairs</label>

          <input
            type="number"
            min={1}
            className="form-control modern-input"
            placeholder="No of existing repairs"
            value={noOfRepairs}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 1) {
                setNoOfRepairs(value);
              }
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* Tyre History */}
      <div className="row g-2 mt-2 align-items-end">
        {/* <div className="col-md-4"> */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowTyreHistory(true)}
          style={{ width: "115px" }}
        >
          Tyre History
        </button>
        {/* </div> */}

        {showTyreHistory && (
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content" style={{ marginTop: "100px" }}>
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

      {/* Is Retreaded */}
      <div className="row g-2 mt-2 align-items-end">
        <div className="col-md-3 d-flex" style={{}}>
          <input
            type="checkbox"
            checked={isRetreaded}
            onChange={(e) => handleIsRetreadedChange(e.target.checked)}
            className="me-2"
          />
          <label className="form-label d-block mt-2">Is Retreaded</label>
        </div>

        {/* No Of Retreads */}
        <div className="col-md-3">
          {isRetreaded && (
            <>
              <label className="form-label">No. of Retreads</label>

              <input
                type="number"
                className="form-control modern-input"
                value={noOfRetreads}
                onChange={(e) => setNoOfRetreads(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Previous Pattern */}
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

        {/* Previous Retreader */}
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

      {/* Divider */}
      <div className="col-12">
        <hr className="mt-2 mb-0" />
      </div>

      {/* Pattern Header */}
      <div className="pattern-header mt-4">
        Customer Pattern Request <small>(Retreads Only)</small>
      </div>

      {/* Pattern Row */}
      <div className="row g-3 mt-2">
        {/* Override */}
        <div className="col-md-3 d-flex">
          <input
            type="checkbox"
            checked={override}
            onChange={(e) => handleOverrideChange(e.target.checked)}
            className="me-2"
          />

          <label className="form-label d-block mt-2">Override</label>
        </div>
      </div>
      <div className="row g-3 mt-2">
        {/* Pattern */}
        <div className="col-md-3">
          <label className="form-label">Pattern</label>

          <select
            className="form-select modern-input"
            value={selectedPattern}
            onChange={handlePatternChange}
            disabled={!category || !tyreClassificationId}
          >
            <option value="">-- Select Pattern --</option>

            {patterns.map((p) => (
              <option key={p.treadPatternId} value={p.patternName}>
                {p.patternName}
              </option>
            ))}
          </select>
        </div>

        {/* Width */}
        <div className="col-md-3">
          <label className="form-label">Width</label>

          <select
            className="form-select modern-input"
            value={selectedWidth}
            onChange={(e) => {
              const width = e.target.value;

              const selectedVariant = selectedPatternObj?.variants.find(
                (v: PatternVariant) => v.width === Number(width),
              );
              console.log("Selected Variant", selectedVariant);

              console.log("Variant Id", selectedVariant?.treadPatternVariantId);

              setSelectedWidth(width);

              setSelectedVariantId(selectedVariant?.treadPatternVariantId);
            }}
            disabled={!selectedPattern}
          >
            <option value="">-- Select Width --</option>

            {widths.map((w, i) => (
              <option key={i} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="col-md-3">
          <label className="form-label">Brand</label>

          <input
            type="text"
            className="form-control modern-input"
            value={brand}
            readOnly
            disabled={!selectedPattern}
          />
        </div>

        {/* Pattern Classification */}
        <div className="col-md-3">
          <label className="form-label">Pattern Classification</label>

          <input
            type="text"
            className="form-control modern-input"
            value={patternClass}
            readOnly
            disabled={!selectedPattern}
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
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

            <button type="button" className="btn btn-primary" onClick={onSave}>
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
    </div>
  );
};

export default RetreadForm;
