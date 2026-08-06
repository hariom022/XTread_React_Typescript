// import type { RailType } from "../type/enveloping.type";
import type { Rail } from "../type/enveloping.type";
interface Props {
  show: boolean;
  selectedRailId: number | null;
  rails: Rail[];
  setSelectedRailId: (value: number) => void;
  onContinue: () => void;

  onClose: () => void;
}

const RailTypeModal = ({
  show,
  selectedRailId,
  rails,
  setSelectedRailId,
  onContinue,
  onClose,
}: Props) => {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Select Rail Location</h5>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

             <div className="modal-body">
              <label className="form-label">
                Rail Type
              </label>

              <select
                className="form-select"
                value={selectedRailId ?? ""}
                onChange={(e) =>
                  setSelectedRailId(
                    Number(e.target.value)
                  )
                }
              >
                <option value="">
                  Select Rail Type
                </option>

                {rails.map((rail) => (
                  <option
                    key={rail.railId}
                    value={rail.railId}
                  >
                    {rail.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                disabled={!selectedRailId}
                onClick={onContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default RailTypeModal;
