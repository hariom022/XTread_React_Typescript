import React from "react";

type Repair = {
  location: string;
  type: string;
};

type Props = {
  newRepair: Repair;
  setNewRepair: React.Dispatch<React.SetStateAction<Repair>>;
  addRepair: () => void;

  damageType: any[];
  location: any[];
};

const RepairSection = ({
  newRepair,
  setNewRepair,
  addRepair,
  damageType,
  location,
}: Props) => {
  return (
    <div className="row g-1 mt-1 mb-0">
      <div className="text-start">
        <label><b>Patches Found</b></label>
      </div>
      {/* Damage Type */}
      <div className="col-md-4">
        <select
          className="form-select"
          style={{ minHeight: "20px" }}
          value={newRepair.type}
          onChange={(e) =>
            setNewRepair({
              ...newRepair,
              type: e.target.value,
            })
          }
        >
          <option value="">
            Damage Type
          </option>

          {damageType.map((item: any) => (
            <option
              key={item.id}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Repair Location */}
      <div className="col-md-4">
        <select
          className="form-select"
          style={{ minHeight: "20px" }}
          value={newRepair.location}
          onChange={(e) =>
            setNewRepair({
              ...newRepair,
              location: e.target.value,
            })
          }
        >
          <option value="">
            Repair Location
          </option>

          {location.map((item: any) => (
            <option
              key={item.id}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4 d-grid">
        <button
          className="btn btn-danger"
          style={{ minHeight: "20px" }}
          onClick={addRepair}
        >
          + Add Repair
        </button>
      </div>
    </div>
  );
};

export default RepairSection;