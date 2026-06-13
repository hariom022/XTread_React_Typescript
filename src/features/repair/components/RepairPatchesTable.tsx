import type { DamagePatch } from "../type/repair.types";
type Props = {
  patches: DamagePatch[];

  setPatches: React.Dispatch<React.SetStateAction<DamagePatch[]>>;
};

const RepairPatchesTable = ({ patches, setPatches }: Props) => {
  const removePatch = (id: number) => {
    setPatches((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patch Type</th>

            <th>Patch Size</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patches.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center">
                No Patches Added
              </td>
            </tr>
          ) : (
            patches.map((item) => (
              <tr key={item.id}>
                <td>{item.patchType}</td>

                <td>{item.patchSize}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removePatch(item.id)}
                  >
                    Remove
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

export default RepairPatchesTable;
