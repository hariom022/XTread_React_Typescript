import { useEffect, useState } from "react";
// import { curingApiService } from "../services/curingApiService";
import curingServiceApi from "../service/curingServiceApi";
interface Autoclave {
  autoclaveId: string;
  name: string;
  sortOrder: number;
  isMold?: boolean;
}

interface Props {
  show: boolean;
  selectedAutoclave: number | "";
  setSelectedAutoclave: React.Dispatch<
    React.SetStateAction<number | "">
  >;
  onContinue: () => void;
  onClose: () => void;
}

const AutoclaveModal = ({
  show,
  selectedAutoclave,
  setSelectedAutoclave,
  onContinue,
  onClose,
}: Props) => {
  const [autoclaves, setAutoclaves] = useState<Autoclave[]>([]);

  useEffect(() => {
    if (show) {
      fetchAutoclaves();
    }
  }, [show]);

 const fetchAutoclaves = async () => {
  try {
    const response = await curingServiceApi.loadAutoClaves();

    const apiAutoclaves = response.data.data || [];

    const moldOptions: Autoclave[] = [
      {
        autoclaveId: "-1",
        name: "18.4-30 Mold 1",
        sortOrder: 999,
        isMold: true,
      },
      {
        autoclaveId: "-2",
        name: "12.4-24 Mold 1",
        sortOrder: 1000,
        isMold: true,
      },
      {
        autoclaveId: "-3",
        name: "9.00-16 Mold 1",
        sortOrder: 1001,
        isMold: true,
      },
    ];

    setAutoclaves([...apiAutoclaves, ...moldOptions]);
  } catch (error) {
    console.error("Error loading autoclaves:", error);
  }
};

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                Select Autoclave
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <label className="form-label">
                Autoclave
              </label>

              <select
                className="form-select"
                value={selectedAutoclave}
                onChange={(e) =>
                  setSelectedAutoclave(
                    e.target.value
                      ? Number(e.target.value)
                      : ""
                  )
                }
              >
                <option value="">
                  Select Autoclave
                </option>

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

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                disabled={!selectedAutoclave}
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

export default AutoclaveModal;