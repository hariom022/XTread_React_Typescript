
import type { Region } from "../types/region.types";

interface RegionTableProps {
  regions: Region[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RegionTable = ({
  regions,
  onView,
  onEdit,
  onDelete,
}: RegionTableProps) => {
  return (
    <div className="region-table-wrapper">
      <table className="table region-table mb-0">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Region Name</th>
            <th>Region Initial</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {regions.length === 0 ? (
            <tr>
              <td colSpan={4} className="region-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            regions.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="region-id">{item.id}</span>
                </td>

                <td>
                  <span className="region-name">{item.regionName}</span>
                </td>

                <td>
                  <span className="region-initial">
                    {item.regionInitial}
                  </span>
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info"
                      title="View region"
                      onClick={() => onView(item.id)}
                    >
                      <i className="bi bi-eye" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      title="Edit region"
                      onClick={() => onEdit(item.id)}
                    >
                      <i className="bi bi-pencil" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Delete region"
                      onClick={() => onDelete(item.id)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegionTable;
