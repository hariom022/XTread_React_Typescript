
import PatternFilters from "../components/PatternFilters";
import PatternTable from "../components/PatternTable";
import usePatterns from "../hooks/usePatterns";
import { RingLoader } from "react-spinners";
import "../styles/patterns.css";

const PatternsPage = () => {
  const {
    categories,
    classifications,
    patterns,
    categoryId,
    classificationId,
    filtersLoading,
    patternsLoading,
    error,
    totalVariants,
    handleCategoryChange,
    handleClassificationChange,
  } = usePatterns();

  return (
    <div className="pattern-page">
      {/* PAGE HEADER */}
      <div className="pattern-page-header">
        <div>
          <h2 className="pattern-page-title">Tread Patterns</h2>
          <p className="pattern-page-subtitle">
            View tread patterns by category and classification
          </p>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="pattern-filter-card">
        <PatternFilters
          categories={categories}
          classifications={classifications}
          categoryId={categoryId}
          classificationId={classificationId}
          loading={filtersLoading}
          onCategoryChange={handleCategoryChange}
          onClassificationChange={handleClassificationChange}
        />
      </div>

      {/* RESULTS CARD */}
      <div className="pattern-card">
        <div className="pattern-results-header">
          <div>
            <h5 className="mb-1">Pattern List</h5>
            <p className="text-muted mb-0">
              {patterns.length} patterns · {totalVariants} variants
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mx-3">
            {error}
          </div>
        )}

        {filtersLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <RingLoader color="#b30815" size={60} />
          </div>
        ) : !categoryId || !classificationId ? (
          <div className="pattern-empty-state">
            Select a category and classification to view patterns.
          </div>
        ) : patternsLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >
            <RingLoader color="#b30815" size={60} />
          </div>
        ) : (
          <PatternTable patterns={patterns} />
        )}
      </div>
    </div>
  );
};

export default PatternsPage;
