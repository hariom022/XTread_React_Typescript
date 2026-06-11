import React from "react";

type Props = {
  resonForRemoval: any[];
  location: any[];

  newPatchRemoval: {
    reasonForRemoval: string;
    location: string;
  };

  setNewPatchRemoval: React.Dispatch<
    React.SetStateAction<{
      reasonForRemoval: string;
      location: string;
    }>
  >;

  addRemove: () => void;
};

const PatchesRemoveSection = ({
  resonForRemoval,
  location,
  newPatchRemoval,
  setNewPatchRemoval,
  addRemove,
}: Props) => {
  return (
    <div className="row g-2 mt-1 mb-0">
      <div className="text-start bg-warning">
        <h6 className="text-light m-1">Patches Removed</h6>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={newPatchRemoval.reasonForRemoval}
          onChange={(e) =>
            setNewPatchRemoval((prev) => ({
              ...prev,
              reasonForRemoval: e.target.value,
            }))
          }
        >
          <option value="">Select Reason For Removal</option>

          {resonForRemoval.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={newPatchRemoval.location}
          onChange={(e) =>
            setNewPatchRemoval((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
        >
          <option value="">Select Location</option>

          {location.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4 d-grid">
        <button className="btn btn-danger" onClick={addRemove}>
          + Add Remove
        </button>
      </div>
    </div>
  );
};

export default PatchesRemoveSection;
