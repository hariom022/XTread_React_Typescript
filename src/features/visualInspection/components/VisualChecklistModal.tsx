import { createPortal } from "react-dom";
import { FULL_VISUAL_CHECKLIST } from "../constants/visualChecklist";

type Props = {
  checkedChecklist: string[];

  setCheckedChecklist: React.Dispatch<React.SetStateAction<string[]>>;

  onClose: () => void;
};

const VisualChecklistModal = ({
  checkedChecklist,
  setCheckedChecklist,
  onClose,
}: Props) => {
  const allChecklistIds = [
    ...FULL_VISUAL_CHECKLIST.left.map((x) => x.id),
    ...FULL_VISUAL_CHECKLIST.right.map((x) => x.id),
  ];

  const isAllSelected = checkedChecklist.length === allChecklistIds.length;

  const toggleChecklist = (id: string) => {
    setCheckedChecklist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setCheckedChecklist([]);
    } else {
      setCheckedChecklist(allChecklistIds);
    }
  };

  return createPortal(
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 1058,
        }}
      ></div>

      <div
        className="modal d-block"
        style={{
          zIndex: 1060,
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header nail-header">
              <h4 className="modal-title fw-bold">
                Visual Inspection Checklist
              </h4>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3 border rounded p-3 bg-light">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />

                  <label className="form-check-label fw-bold">
                    Select All Checklist
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <table className="table table-bordered checklist-table">
                    <tbody>
                      {FULL_VISUAL_CHECKLIST.left.map((item) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={checkedChecklist.includes(item.id)}
                              onChange={() => toggleChecklist(item.id)}
                            />

                            {item.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  <table className="table table-bordered checklist-table">
                    <tbody>
                      {FULL_VISUAL_CHECKLIST.right.map((item) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={checkedChecklist.includes(item.id)}
                              onChange={() => toggleChecklist(item.id)}
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

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>
                Save Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default VisualChecklistModal;
