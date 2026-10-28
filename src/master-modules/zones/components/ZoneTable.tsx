
import type { Zone } from "../types/zone.types";

interface ZoneTableProps {
  zones: Zone[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ZoneTable = ({
  zones,
  onView,
  onEdit,
  onDelete,
}: ZoneTableProps) => {
  return (
    <div className="zone-table-wrapper">
      <table className="table zone-table mb-0">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Region</th>
            <th>Zone Name</th>
            <th>Zone Initial</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {zones.length === 0 ? (
            <tr>
              <td colSpan={5} className="zone-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            zones.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="zone-id">{item.id}</span>
                </td>

                <td>
                  <span className="zone-region-badge">
                    {item.regionName || "—"}
                  </span>
                </td>

                <td>
                  <span className="zone-name">{item.zoneName}</span>
                </td>

                <td>
                  <span className="zone-initial">{item.zoneInitial}</span>
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info"
                      title="View"
                      onClick={() => onView(item.id)}
                    >
                      <i className="bi bi-eye" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                      onClick={() => onEdit(item.id)}
                    >
                      <i className="bi bi-pencil" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
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

export default ZoneTable;
