import React from "react";

type PatchRemoval = {
  reasonForRemoval: string;
  location: string;
};

type Props = {
  patchRemovals: PatchRemoval[];

  setPatchRemovals: React.Dispatch<
    React.SetStateAction<PatchRemoval[]>
  >;
};

const PatchRemovalTable = ({
  patchRemovals,
  setPatchRemovals,
}: Props) => {
  const removePatch = (
    index: number
  ) => {
    setPatchRemovals(
      patchRemovals.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <div className="table-responsive mt-1">
      <table className="table table-bordered">
        <thead className="table-danger">
          <tr>
            <th>
              Reason For Removal
            </th>

            <th>Location</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patchRemovals.length ===
          0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center text-muted"
              >
                No Patch Removal Added
              </td>
            </tr>
          ) : (
            patchRemovals.map(
              (
                item,
                index
              ) => (
                <tr key={index}>
                  <td>
                    {
                      item.reasonForRemoval
                    }
                  </td>

                  <td>
                    {
                      item.location
                    }
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        removePatch(
                          index
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatchRemovalTable;