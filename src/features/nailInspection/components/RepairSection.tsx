import React from "react";

type Repair = {
  location: string;
  type: string;
};

type Props = {
  newRepair: Repair;
  setNewRepair: React.Dispatch<React.SetStateAction<Repair>>;
  addRepair: () => void;
};

const RepairSection = ({
  newRepair,
  setNewRepair,
  addRepair,
}: Props) => {
  return (
    <div className="row g-2 mt-1 mb-0">
      <div className="col-md-4">
        <select
          className="form-select"
          value={newRepair.type}
          onChange={(e) =>
            setNewRepair({
              ...newRepair,
              type: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Damage Type
          </option>

          <option value="Puncture">
            Puncture
          </option>

          <option value="Side Wall Cut">
            Side Wall Cut
          </option>
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={newRepair.location}
          onChange={(e) =>
            setNewRepair({
              ...newRepair,
              location: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Repair Location
          </option>

          <option value="Side Wall">
            Side Wall
          </option>

          <option value="Crown">
            Crown
          </option>
        </select>
      </div>

      <div className="col-md-4 d-grid">
        <button
          className="btn btn-danger"
          onClick={addRepair}
        >
          + Add Repair
        </button>
      </div>
    </div>
  );
};

export default RepairSection;