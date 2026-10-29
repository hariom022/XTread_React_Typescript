
import { useState } from "react";
import type { TreadPattern, TreadPatternVariant } from "../types/pattern.types";

interface PatternTableProps {
  patterns: TreadPattern[];
}

const PatternTable = ({ patterns }: PatternTableProps) => {
  const [selectedPattern, setSelectedPattern] =
    useState<TreadPattern | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<TreadPatternVariant | null>(null);

  return (
    <>
      <div className="pattern-table-wrapper">
        <table className="table pattern-table mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Brand</th>
              <th>Pattern Name</th>
              <th>Category</th>
              <th>Classification</th>
              <th>Variants</th>
            </tr>
          </thead>

          <tbody>
            {patterns.length === 0 ? (
              <tr>
                <td colSpan={6} className="pattern-empty-state">
                  No Patterns Found
                </td>
              </tr>
            ) : (
              patterns.map((pattern, index) => (
                <tr key={pattern.treadPatternId}>
                  <td>{index + 1}</td>
                  <td>{pattern.brand}</td>
                  <td>{pattern.patternName}</td>
                  <td>{pattern.categoryName}</td>
                  <td>
                    <span className="pattern-classification">
                      {pattern.tyreClassificationName}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="pattern-variants-button"
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setSelectedVariant(null);
                      }}
                      disabled={pattern.variants.length === 0}
                    >
                      View {pattern.variants.length} variant
                      {pattern.variants.length !== 1 ? "s" : ""}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VARIANTS MODAL */}
      {selectedPattern && (
        <div
          className="modal fade show d-block pattern-modal-backdrop"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPattern(null);
              setSelectedVariant(null);
            }
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    {selectedPattern.brand} - {selectedPattern.patternName}
                  </h5>
                  <small className="text-muted">
                    {selectedPattern.categoryName} |{" "}
                    {selectedPattern.tyreClassificationName} |{" "}
                    {selectedPattern.variants.length} variants
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedPattern(null);
                    setSelectedVariant(null);
                  }}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                {selectedVariant ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm mb-3"
                      onClick={() => setSelectedVariant(null)}
                    >
                      <i className="bi bi-arrow-left me-1" />
                      Back to variants
                    </button>

                    <h6 className="mb-3">Variant Details</h6>

                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Width</th>
                            <td>{selectedVariant.width}</td>
                          </tr>
                          {/* <tr>
                            <th>SAP Code</th>
                            <td>{selectedVariant.sapCode || "—"}</td>
                          </tr> */}
                          <tr>
                            <th>SAP Description</th>
                            <td>{selectedVariant.sapDescription || "—"}</td>
                          </tr>
                          {/* <tr>
                            <th>Tyre Size ID</th>
                            <td>{selectedVariant.tyreSizeId ?? "—"}</td>
                          </tr>
                          <tr>
                            <th>Tyre Size</th>
                            <td>{selectedVariant.tyreSizeName || "—"}</td>
                          </tr> */}
                          {/* <tr>
                            <th>Sort Order</th>
                            <td>{selectedVariant.sortOrder}</td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : selectedPattern.variants.length === 0 ? (
                  <div className="pattern-empty-state">
                    No variants available for this pattern.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered pattern-variant-modal-table mb-0">
                      <thead>
                        <tr>
                          <th>Serial No.</th>
                          <th>Width</th>
                          {/* <th>SAP Code</th> */}
                          <th>SAP Description</th>
                          {/* <th>Tyre Size</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedPattern.variants.map((variant, index) => (
                          <tr key={variant.treadPatternVariantId}>
                            <td>{index + 1}</td>
                            <td>{variant.width}</td>
                            {/* <td>{variant.sapCode || "—"}</td> */}
                            <td>{variant.sapDescription || "—"}</td>
                            {/* <td>{variant.tyreSizeName || "—"}</td> */}
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                title="View variant details"
                                onClick={() => setSelectedVariant(variant)}
                              >
                                <i className="bi bi-eye" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedPattern(null);
                    setSelectedVariant(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatternTable;
