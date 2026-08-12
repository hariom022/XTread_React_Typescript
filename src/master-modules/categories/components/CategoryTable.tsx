import type { Category } from "../types/categories.types";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
}

const CategoryTable = ({
  categories,
  loading,
}: CategoryTableProps) => {
  return (
    <div className="category-table-wrapper">
      <table className="category-table">

        <thead>
          <tr>
            <th>#</th>
            {/* <th>Category ID</th> */}
            <th>Category Name</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td
                colSpan={3}
                className="category-empty-state"
              >
                Loading categories...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="category-empty-state"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((item, index) => (
              <tr key={item.categoryId}>

                <td>
                  <span className="category-index">
                    {index + 1}
                  </span>
                </td>
{/* 
                <td>
                  <span className="category-id">
                    {item.categoryId}
                  </span>
                </td> */}

                <td>
                  <span className="category-name">
                    {item.categoryName}
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

export default CategoryTable;