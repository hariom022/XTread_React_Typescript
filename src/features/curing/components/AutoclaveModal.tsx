import { useEffect, useState } from "react";
import curingServiceApi from "../service/curingServiceApi";

interface Autoclave {
  autoclaveId: number;
  name: string;
  sortOrder: number;
}

interface Mold {
  moldId: number;
  name: string;
  sortOrder: number;
}

interface Props {
  show: boolean;

  selectedAutoclave: number | "";
  selectedMold: number | "";

  setSelectedAutoclave: (value: number | "") => void;

  setSelectedMold: (value: number | "") => void;

  // onContinue: () => void;
  onClose: () => void;
}

const AutoclaveModal = ({
  show,
  selectedAutoclave,
  selectedMold,
  setSelectedAutoclave,
  setSelectedMold,
  // onContinue,
  onClose,
}: Props) => {
  const [autoclaves, setAutoclaves] = useState<Autoclave[]>([]);
  const [mold, setMold] = useState<Mold[]>([]);

  useEffect(() => {
    if (show) {
      fetchAutoclaves();
      fetchModal();
    }
  }, [show]);

  const fetchAutoclaves = async () => {
    try {
      const response = await curingServiceApi.loadAutoClaves();

      const apiAutoclaves = response.data.data || [];

      setAutoclaves(apiAutoclaves);
    } catch (error) {
      console.error("Error loading autoclaves:", error);
    }
  };

  const fetchModal = async () => {
    try {
      const res = await curingServiceApi.loadMold();

      setMold(res.data.data || []);
    } catch (error) {
      console.error("Error loading mold:", error);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Select Autoclave / Mold</h5>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* AUToclave */}
              <div className="mb-3">
                <label className="form-label">Autoclave</label>

                <select
                  className="form-select"
                  value={selectedAutoclave}
                  disabled={selectedMold !== ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";

                    setSelectedAutoclave(value);
                  }}
                >
                  <option value="">Select Autoclave</option>

                  {autoclaves.map((autoclave) => (
                    <option
                      key={autoclave.autoclaveId}
                      value={autoclave.autoclaveId}
                    >
                      {autoclave.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* MOLD */}
              <div className="mold-selection">
                <label className="form-label">Mold</label>

                <select
                  className="form-select"
                  value={selectedMold}
                  disabled={selectedAutoclave !== ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";

                    setSelectedMold(value);
                  }}
                >
                  <option value="">Select Mold</option>

                  {mold.map((item) => (
                    <option key={item.moldId} value={item.moldId}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              {/* <button
                className="btn btn-primary"
                disabled={selectedAutoclave === "" && selectedMold === ""}
                onClick={onContinue}
              >
                Continue
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AutoclaveModal;
