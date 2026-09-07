import useDispatchTeamModal from "../hooks/useDispatchTeamModal";
import type { DispatchTeam } from "../type/dispatch.types";

interface Props {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  setDispatchTeam: React.Dispatch<React.SetStateAction<DispatchTeam>>;
  setIsInternal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DispatchTeamModal = ({
  show,
  onClose,
  onContinue,
  setDispatchTeam,
  setIsInternal,
}: Props) => {
  const modal = useDispatchTeamModal();

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header text-white">
              <h5 className="modal-title text-white">Dispatch Team</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  modal.reset();
                  onClose();
                }}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* COURIER TYPE */}
              <div className="mb-3">
                <label className="form-label">Courier Type</label>

                <select
                  className="form-select"
                  value={modal.courierType}
                  onChange={(e) => {
                    const value = e.target.value;

                    modal.setCourierType(value);

                    if (value === "Internal") {
                      modal.setSelectedCourierType(2);
                    } else if (value === "External") {
                      modal.setSelectedCourierType(1);
                    } else {
                      modal.setSelectedCourierType(null);
                    }
                  }}
                >
                  <option value="">Select Courier Type</option>
                  <option value="External">External</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>

              {/* CONTINUE BUTTON */}
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!modal.selectedCourierType}
                  onClick={() => {
                    if (!modal.selectedCourierType) {
                      alert("Please select Courier Type");
                      return;
                    }

                    // 1 = External
                    // 2 = Internal
                    setIsInternal(modal.selectedCourierType === 2);

                    setDispatchTeam({
                      salesRep: "",
                      courierName: "",
                      regNo: "",
                      driverName: "",
                      driverId: 0,
                      driverIdNo: "",
                      courierServiceId: 0,
                    });

                    modal.reset();

                    onContinue();
                  }}
                >
                  Continue to Dispatch →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DispatchTeamModal;