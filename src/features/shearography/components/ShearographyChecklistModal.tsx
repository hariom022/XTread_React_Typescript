import { createPortal } from "react-dom";
import { SHEAROGRAPHY_CHECKLIST } from "../constants/shearographyChecklist";

type Props = {
  show: boolean;
  checkedChecklist: string[];
  selectAllChecklist: boolean;
  setShow: (value: boolean) => void;
  setChecklistSaved: (value: boolean) => void;
  toggleChecklist: (id: string) => void;
  handleSelectAllChecklist: () => void;
  resetChecklist: () => void;
};

const ShearographyChecklistModal = ({
  show,
  checkedChecklist,
  selectAllChecklist,
  setShow,
  setChecklistSaved,
  toggleChecklist,
  handleSelectAllChecklist,
  resetChecklist,
}: Props) => {
  if (!show) return null;

  return createPortal(
    <>
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1060,
          background: "rgba(21, 17, 17, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      ></div>

      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ zIndex: 1070 }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header shearo-header">
              <h5 className="modal-title">
                Shearography Checklist
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={resetChecklist}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <table className="table table-bordered checklist-table mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold bg-light">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={selectAllChecklist}
                        onChange={handleSelectAllChecklist}
                      />
                      Select All
                    </td>
                  </tr>

                  {SHEAROGRAPHY_CHECKLIST.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={checkedChecklist.includes(
                            item.id
                          )}
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

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  if (
                    checkedChecklist.length !==
                    SHEAROGRAPHY_CHECKLIST.length
                  ) {
                    alert(
                      "Please complete all checklist items"
                    );

                    return;
                  }

                  setChecklistSaved(true);

                  console.log(
                    "Checklist Saved",
                    checkedChecklist
                  );

                  setShow(false);
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

export default ShearographyChecklistModal;