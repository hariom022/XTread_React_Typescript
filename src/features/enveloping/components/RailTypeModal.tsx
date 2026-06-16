import type { RailType } from "../type/enveloping.type";

interface Props {
  show: boolean;

  railType: RailType | "";

  setRailType: (
    value: RailType,
  ) => void;

  onContinue: () => void;

  onClose: () => void;
}

const RailTypeModal = ({
  show,
  railType,
  setRailType,
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
              <h5 className="modal-title">
                Select Rail Location
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <label className="form-label">
                Rail Type
              </label>

              <select
                className="form-select"
                value={railType}
                onChange={(e) =>
                  setRailType(
                    e.target.value as RailType,
                  )
                }
              >
                <option value="">
                  Select Rail Type
                </option>

                <option value="Marangoni">
                  Marangoni
                </option>

                <option value="Elgi">
                  Elgi
                </option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                disabled={!railType}
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