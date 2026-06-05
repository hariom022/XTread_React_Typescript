import { createPortal } from "react-dom";

type ChecklistItem = {
  id: string;
  label: string;
};

type Props = {
  show: boolean;
  onClose: () => void;

  leftItems: ChecklistItem[];
  rightItems: ChecklistItem[];

  checkedItems: string[];

  isAllSelected: boolean;
  isChecklistComplete: boolean;

  toggleChecklist: (id: string) => void;
  handleSelectAll: () => void;
  onSave: () => void;
};

const ChecklistModal = ({
  show,
  onClose,
  leftItems,
  rightItems,
  checkedItems,
  isAllSelected,
  isChecklistComplete,
  toggleChecklist,
  handleSelectAll,
  onSave,
}: Props) => {
  if (!show) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
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
                Nail Inspection Checklist
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Select All */}
              <div className="mb-3 border rounded p-2 bg-light">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="selectAllChecklist"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />

                  <label
                    htmlFor="selectAllChecklist"
                    className="form-check-label fw-semibold"
                  >
                    Select All Checklist
                  </label>
                </div>
              </div>

              <div className="row">
                {/* Left Side */}
                <div className="col-md-6">
                  <table className="table table-bordered checklist-table">
                    <tbody>
                      {leftItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={checkedItems.includes(item.id)}
                              onChange={() =>
                                toggleChecklist(item.id)
                              }
                            />

                            {item.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right Side */}
                <div className="col-md-6">
                  <table className="table table-bordered checklist-table">
                    <tbody>
                      {rightItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={checkedItems.includes(item.id)}
                              onChange={() =>
                                toggleChecklist(item.id)
                              }
                            />

                            {item.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!isChecklistComplete) {
                    alert(
                      "Please select all checklist items to continue"
                    );
                    return;
                  }

                  onSave();
                }}
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

export default ChecklistModal;