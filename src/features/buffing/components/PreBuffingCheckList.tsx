import { createPortal } from "react-dom";
import { PRE_BUFFING_CHECKLIST } from "../constants/preBuffingCheckList";

interface Props {
  show: boolean;

  checkedChecklist: string[];

  toggleChecklist: (id: string) => void;

  selectAllChecklist: boolean;

  handleSelectAllChecklist: () => void;

  onSave: () => void;

  onClose: () => void;
}

const PreBuffingChecklist = ({
  show,
  checkedChecklist,
  toggleChecklist,
  selectAllChecklist,
  handleSelectAllChecklist,
  onSave,
  onClose,
}: Props) => {
  if (!show) return null;

  return createPortal(
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ zIndex: 1060 }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* Header */}

            <div className="modal-header nail-header">
              <h5 className="modal-title">
                Pre Buffing Checklist
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}

            <div className="modal-body">

              <table className="table table-bordered align-middle text-center">

                <tbody>

                  <tr>
                    <td className="fw-bold">

                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectAllChecklist}
                        onChange={
                          handleSelectAllChecklist
                        }
                      />

                      Select All

                    </td>
                  </tr>

                  {PRE_BUFFING_CHECKLIST.map(
                    (item) => (
                      <tr key={item.id}>
                        <td>

                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={checkedChecklist.includes(
                              item.id
                            )}
                            onChange={() =>
                              toggleChecklist(
                                item.id
                              )
                            }
                          />

                          {item.label}

                        </td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}

            <div className="modal-footer">

              <button
                className="btn btn-primary w-100"
                onClick={onSave}
              >
                Save Checklist
              </button>

            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PreBuffingChecklist;