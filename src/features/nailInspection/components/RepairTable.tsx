import React from "react";

type Repair = {
  location: string;
  type: string;
};

type Props = {
  repairs: Repair[];
  setRepairs: React.Dispatch<
    React.SetStateAction<Repair[]>
  >;
};

const RepairTable = ({
  repairs,
  setRepairs,
}: Props) => {
  const removeRepair = (index: number) => {
    setRepairs(
      repairs.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="table-responsive mt-1">
      <table className="table table-bordered">
        <thead className="table-danger">
          <tr>
            <th>Damage Type</th>
            <th>Repair Location</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {repairs.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center text-muted"
              >
                No repairs added
              </td>
            </tr>
          ) : (
            repairs.map((repair, index) => (
              <tr key={index}>
                <td>{repair.type}</td>

                <td>{repair.location}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      removeRepair(index)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RepairTable;