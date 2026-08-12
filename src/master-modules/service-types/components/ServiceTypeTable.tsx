import type { ServiceType } from "../types/serviceType.types";

interface ServiceTypeTableProps {
  serviceTypes: ServiceType[];
}

const ServiceTypeTable = ({
  serviceTypes,
}: ServiceTypeTableProps) => {
  return (
    <div className="service-type-table-wrapper">
      <table className="table service-type-table mb-0">
        <thead>
          <tr>
            <th>
              Service Type Number
            </th>

            <th>Service Type Name</th>

            <th>Service Type Code</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {serviceTypes.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="service-type-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            serviceTypes.map((item) => (
              <tr key={item.serviceTypeId}>
                {/* ID */}
                <td>
                  <span className="service-type-id">
                    {item.serviceTypeId}
                  </span>
                </td>

                {/* NAME */}
                <td>
                  <span className="service-type-name">
                    {item.serviceTypeName}
                  </span>
                </td>

                {/* CODE */}
                <td>
                  <span className="service-type-code">
                    {item.serviceTypeCode}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTypeTable;