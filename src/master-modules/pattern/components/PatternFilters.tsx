
import type {
  Category,
  TyreClassification,
} from "../types/pattern.types";

interface PatternFiltersProps {
  categories: Category[];
  classifications: TyreClassification[];
  categoryId: string;
  classificationId: string;
  loading: boolean;
  onCategoryChange: (value: string) => void;
  onClassificationChange: (value: string) => void;
}

const PatternFilters = ({
  categories,
  classifications,
  categoryId,
  classificationId,
  loading,
  onCategoryChange,
  onClassificationChange,
}: PatternFiltersProps) => {
  return (
    <div className="pattern-filters">
      <div className="pattern-filter-field">
        <label htmlFor="categoryId" className="form-label">
          Category
        </label>

        <select
          id="categoryId"
          className="form-select"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="pattern-filter-field">
        <label htmlFor="classificationId" className="form-label">
          Classification
        </label>

        <select
          id="classificationId"
          className="form-select"
          value={classificationId}
          onChange={(e) => onClassificationChange(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Classification</option>

          {classifications.map((classification) => (
            <option
              key={classification.tyreClassificationId}
              value={classification.tyreClassificationId}
            >
              {classification.tyreClassificationName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PatternFilters;
