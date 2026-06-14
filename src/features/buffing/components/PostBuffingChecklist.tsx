import { createPortal } from "react-dom";
import { POST_BUFFING_CHECKLIST } from "../constants/postBuffingCheckList";

interface Props {
  show: boolean;

  checkedChecklist: string[];

  toggleChecklist: (id: string) => void;

  selectAllChecklist: boolean;

  handleSelectAllChecklist: () => void;

  onSave: () => void;

  onClose: () => void;
}

const PostBuffingChecklist = ({
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
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header nail-header">
            <h5 className="modal-title">Post Buffing Checklist</h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            <table className="table table-bordered align-middle">
              <tbody>
                <tr>
                  <td>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectAllChecklist}
                        onChange={handleSelectAllChecklist}
                      />

                      <label className="form-check-label fw-bold">
                        Select All
                      </label>
                    </div>
                  </td>
                </tr>

                {POST_BUFFING_CHECKLIST.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={checkedChecklist.includes(item.id)}
                          onChange={() => toggleChecklist(item.id)}
                        />

                        <label className="form-check-label">{item.label}</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-footer">
            {/* <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button> */}

            <button className="btn btn-primary" onClick={onSave}>
              Save Checklist
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PostBuffingChecklist;
