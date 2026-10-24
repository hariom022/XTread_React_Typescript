import { useState, useEffect } from "react";
import holdTyreServiceApi from "../service/holdTyreServiceApi";

type Props = {
  selectedItem: any;
  onClose: () => void;
  onApproved: () => Promise<void>;
};

type SuggestedPattern = {
  orderCasingId: number;
  rejectionReasonId: number;
  rejectionReason: string;
  treadPatternId: number;
  patternName: string;
  brand: string;
  treadPatternVariantId: number;
  width: number;
  sapCode: string;
  sapDescription: string;
  remarks: string;
  suggestedAtUtc: string;
  suggestedBy: string;
};

const PreBuffingPatternApprovalModal = ({
  selectedItem,
  onClose,
  onApproved,
}: Props) => {
  const [changeRequestedPattern, setChangeRequestedPattern] = useState(false);

  const [selectedPattern, setSelectedPattern] = useState("");

  const [selectedWidth, setSelectedWidth] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");

  const [comments, setComments] = useState("");
  const [casingDetails, setCasingDetails] = useState<any>(null);

  const [loadingCasingDetails, setLoadingCasingDetails] = useState(false);

  const [patternSuggestions, setPatternSuggestions] = useState<any[]>([]);
  const [loadingPatternSuggestions, setLoadingPatternSuggestions] =
    useState(false);

  const [patternVariants, setPatternVariants] = useState<any[]>([]);
  const [loadingPatternVariants, setLoadingPatternVariants] = useState(false);
  const [isValidatingMaterial, setIsValidatingMaterial] = useState(false);

  const [isFinishedMaterialValid, setIsFinishedMaterialValid] = useState<
    boolean | null
  >(null);

  const [materialValidationMessage, setMaterialValidationMessage] =
    useState("");

  const [suggestedPattern, setSuggestedPattern] =
    useState<SuggestedPattern | null>(null);

  const [loadingSuggestedPattern, setLoadingSuggestedPattern] = useState(false);

  const [suggestedPatternError, setSuggestedPatternError] = useState("");

  //get order casing details for the selected item
  useEffect(() => {
    const loadCasingDetails = async () => {
      if (!selectedItem?.orderCasingId) {
        return;
      }

      try {
        setLoadingCasingDetails(true);

        const response = await holdTyreServiceApi.getOrderCasingById(
          selectedItem.orderCasingId,
        );

        console.log("PRE-BUFFING CASING DETAILS:", response);

        if (response?.data?.success) {
          setCasingDetails(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load casing details:", error);

        setCasingDetails(null);
      } finally {
        setLoadingCasingDetails(false);
      }
    };

    loadCasingDetails();
  }, [selectedItem?.orderCasingId]);

  const checkFinishedMaterial = async (
    tyreSize: string,
    patternName: string,
  ) => {
    if (!tyreSize || !patternName) {
      setIsFinishedMaterialValid(null);
      setMaterialValidationMessage("");
      return;
    }

    try {
      setIsValidatingMaterial(true);
      setIsFinishedMaterialValid(null);
      setMaterialValidationMessage("");

      const response = await holdTyreServiceApi.validateFinishedMaterial(
        tyreSize,
        patternName,
      );

      const result = response.data;

      console.log("Finished Material Response:", result);

      if (result?.success === true && result?.data === true) {
        setIsFinishedMaterialValid(true);
        setMaterialValidationMessage(
          "Finished material validated successfully.",
        );
      } else {
        setIsFinishedMaterialValid(false);
        setMaterialValidationMessage(
          `No finished material (ZFER) found for tyre size ${tyreSize} and pattern ${patternName}.`,
        );
      }
    } catch (error: unknown) {
      console.error("Finished material validation failed:", error);

      const apiMessage = (
        error as {
          response?: {
            data?: {
              error?: {
                message?: string;
              };
            };
          };
        }
      )?.response?.data?.error?.message;

      setIsFinishedMaterialValid(false);
      setMaterialValidationMessage(
        apiMessage ||
          `No finished material (ZFER) found for tyre size ${tyreSize} and pattern ${patternName}.`,
      );
    } finally {
      setIsValidatingMaterial(false);
    }
  };
  // =========================================================
  // GET AVAILABLE TREAD PATTERNS
  // =========================================================
  useEffect(() => {
    const loadTreadPatterns = async () => {
      if (!casingDetails || !changeRequestedPattern) {
        return;
      }

      const categoryId = casingDetails.category?.categoryId;

      const tyreClassificationId = casingDetails.tyreClassification?.id;

      const isRetread = casingDetails.isRetreaded ?? false;

      const override = casingDetails.retreadDetail?.isPatternOverride ?? false;

      if (!categoryId || !tyreClassificationId) {
        return;
      }

      try {
        setLoadingPatternSuggestions(true);

        const response = await holdTyreServiceApi.getTreadPatterns(
          categoryId,
          tyreClassificationId,
          isRetread,
          override,
        );

        console.log("AVAILABLE TREAD PATTERNS:", response);

        if (response?.data?.success) {
          setPatternSuggestions(response.data.data || []);
        } else {
          setPatternSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to load tread patterns:", error);

        setPatternSuggestions([]);
      } finally {
        setLoadingPatternSuggestions(false);
      }
    };

    loadTreadPatterns();
  }, [casingDetails, changeRequestedPattern]);

  useEffect(() => {
    let isMounted = true;

    const loadSuggestedPattern = async () => {
      const orderCasingId = selectedItem?.orderCasingId;

      if (!orderCasingId) {
        setSuggestedPattern(null);
        return;
      }

      try {
        setLoadingSuggestedPattern(true);
        setSuggestedPatternError("");
        setSuggestedPattern(null);

        const response =
          await holdTyreServiceApi.getSuggestedPattern(orderCasingId);

        // Supports either a direct response body or an API envelope.
        const data = response?.data?.data ?? response?.data;

        if (!data?.treadPatternId) {
          throw new Error("No suggested pattern was found for this casing.");
        }

        if (isMounted) {
          setSuggestedPattern(data);

          // Default values in Approved Pattern Change
          setSelectedPattern(String(data.treadPatternId));
          setSelectedWidth(String(data.width ?? ""));
          setSelectedBrand(data.brand || "");

          setPatternVariants([]);
          setIsFinishedMaterialValid(null);
          setMaterialValidationMessage("");
        }

        console.log("SUGGESTED PATTERN RESPONSE:", data);
      } catch (error: any) {
        console.error("Failed to load suggested pattern:", error);

        if (isMounted) {
          setSuggestedPattern(null);
          setSuggestedPatternError(
            error?.response?.data?.error?.message ||
              error?.response?.data?.message ||
              error?.message ||
              "Failed to load the suggested pattern.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingSuggestedPattern(false);
        }
      }
    };

    void loadSuggestedPattern();

    return () => {
      isMounted = false;
    };
  }, [selectedItem?.orderCasingId]);

  //   useEffect(() => {
  //     if (!suggestedPattern || patternSuggestions.length === 0) {
  //       return;
  //     }

  //     const matchingPattern = patternSuggestions.find(
  //       (pattern) =>
  //         Number(pattern.treadPatternId) ===
  //         Number(suggestedPattern.treadPatternId),
  //     );

  //     if (!matchingPattern) {
  //       setSuggestedPatternError(
  //         `Suggested pattern "${suggestedPattern.patternName}" is not available in the pattern list.`,
  //       );
  //       return;
  //     }

  //     let isMounted = true;

  //     const bindApprovedPattern = async () => {
  //       const patternId = String(suggestedPattern.treadPatternId);
  //       const patternName = suggestedPattern.patternName;
  //       const tyreSize = casingDetails?.tyreSize?.casingSize;

  //       setSelectedPattern(patternId);
  //       setSelectedBrand(suggestedPattern.brand || "");
  //       setSelectedWidth(String(suggestedPattern.width ?? ""));
  //       setPatternVariants([]);
  //       setIsFinishedMaterialValid(null);
  //       setMaterialValidationMessage("");

  //       if (tyreSize && patternName) {
  //         void checkFinishedMaterial(tyreSize, patternName);
  //       }

  //       try {
  //         setLoadingPatternVariants(true);

  //         const response = await holdTyreServiceApi.getTreadPatternVariants(
  //           Number(patternId),
  //         );

  //         if (!isMounted) return;

  //         if (response?.data?.success) {
  //           const patternData = response.data.data?.[0];
  //           const variants = patternData?.variants || [];

  //           setPatternVariants(variants);

  //           // Prefer the exact suggested width variant.
  //           const matchingVariant = variants.find(
  //             (variant: any) =>
  //               Number(variant.treadPatternVariantId) ===
  //                 Number(suggestedPattern.treadPatternVariantId) ||
  //               Number(variant.width) === Number(suggestedPattern.width),
  //           );

  //           if (matchingVariant) {
  //             setSelectedWidth(String(matchingVariant.width));
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Failed to load suggested pattern variants:", error);
  //       } finally {
  //         if (isMounted) {
  //           setLoadingPatternVariants(false);
  //         }
  //       }
  //     };

  //     void bindApprovedPattern();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [suggestedPattern, patternSuggestions, casingDetails]);


const handleApprove = async () => {
  const orderCasingId = Number(selectedItem?.orderCasingId);

  if (!orderCasingId) {
    alert("Order Casing ID is missing.");
    return;
  }

  let treadPatternId: number;
  let treadPatternVariantId: number;

  if (changeRequestedPattern) {
    // Use the values selected in Approved Pattern Change.
    treadPatternId = Number(selectedPattern);

    const selectedVariant = patternVariants.find(
      (variant: any) =>
        String(variant.width) === String(selectedWidth),
    );

    // Fallback to the suggested variant when it matches.
    const suggestedVariantMatches =
      String(suggestedPattern?.treadPatternId) ===
        String(selectedPattern) &&
      String(suggestedPattern?.width) === String(selectedWidth);

    treadPatternVariantId = selectedVariant
      ? Number(selectedVariant.treadPatternVariantId)
      : suggestedVariantMatches
        ? Number(suggestedPattern?.treadPatternVariantId)
        : NaN;

    if (!treadPatternId || !selectedWidth || !treadPatternVariantId) {
      alert("Please select a valid Pattern and Width.");
      return;
    }
  } else {
    // When the checkbox is unchecked, approve the technician's
    // suggested pattern and variant.
    treadPatternId = Number(suggestedPattern?.treadPatternId);
    treadPatternVariantId = Number(
      suggestedPattern?.treadPatternVariantId,
    );

    if (!treadPatternId || !treadPatternVariantId) {
      alert("Suggested Pattern or Width information is missing.");
      return;
    }
  }

  const payload = {
    treadPatternId,
    treadPatternVariantId,
    remarks: null,
  };

  try {
    console.log("APPROVE PRE-BUFFING HOLD PAYLOAD:", payload);

    await holdTyreServiceApi.approvePreBuffingHold(
      orderCasingId,
      payload,
    );

    await onApproved();
    onClose();
  } catch (error: any) {
    console.error("Failed to approve Pre-Buffing Hold:", error);

    alert(
      error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to approve Pre-Buffing Hold.",
    );
  }
};

const handleReject = async () => {
  const orderCasingId = Number(selectedItem?.orderCasingId);

  if (!orderCasingId) {
    alert("Order Casing ID is missing.");
    return;
  }

  const remarks = comments.trim();

  if (!remarks) {
    alert("Please enter remarks before rejecting.");
    return;
  }

  const payload = {
    remarks,
  };

  try {
    console.log("REJECT PRE-BUFFING HOLD PAYLOAD:", payload);

    await holdTyreServiceApi.rejectPreBuffingHold(
      orderCasingId,
      payload,
    );

    await onApproved();
    onClose();
  } catch (error: any) {
    console.error("Failed to reject Pre-Buffing Hold:", error);

    alert(
      error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to reject Pre-Buffing Hold.",
    );
  }
};

  if (!selectedItem) return null;
  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>

      {/* MODAL */}
      <div
        className="modal d-block"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header bg-approve text-white">
              <h5 className="modal-title fw-bold">
                PRE BUFFING PATTERN CHANGE APPROVAL
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div>
                {/* TOP INFO */}
                <div className="modal-info m-0 row text-nowrap">
                  <div className="col">
                    <strong>Production No</strong>
                    <div>
                      {casingDetails?.productionNumber ||
                        selectedItem?.casing ||
                        "-"}
                    </div>
                  </div>

                  <div className="col">
                    <strong>Tyre Ref No</strong>
                    <div>
                      {casingDetails?.tyreReferenceNumber ||
                        selectedItem?.serial ||
                        "-"}
                    </div>
                  </div>

                  <div className="col">
                    <strong>Customer Name</strong>
                    <div>
                      {casingDetails?.customerName ||
                        selectedItem?.customerName ||
                        "-"}
                    </div>
                  </div>

                  <div className="col">
                    <strong>Tyre Size</strong>
                    <div>
                      {casingDetails?.tyreSize?.casingSize ||
                        selectedItem?.tyreSize ||
                        "-"}
                    </div>
                  </div>

                  <div className="col">
                    <strong>Requested Pattern</strong>
                    <div>
                      {casingDetails?.retreadDetail?.patternName || "-"}
                    </div>
                  </div>
                </div>

                {/* CASING / PATTERN DETAILS */}
                <div className="row g-2 mt-1">
                  {/* CASING DETAILS */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header fw-bold">Casing Details</div>

                      <div className="card-body m-0 p-1">
                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Make</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={casingDetails?.tyreMake?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Model</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={casingDetails?.model || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-5 fw-semibold">Casing Size</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={casingDetails?.tyreSize?.casingSize || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER REQUESTED PATTERN */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header fw-bold">
                        Customer Requested Pattern
                      </div>

                      <div className="card-body m-0 p-1">
                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Brand</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={casingDetails?.retreadDetail?.brand || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Pattern</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                casingDetails?.retreadDetail?.patternName || ""
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row ">
                          <div className="col-5 fw-semibold">Width</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={casingDetails?.retreadDetail?.width ?? ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TECHNICIAN SUGGESTED PATTERN */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header fw-bold">
                        Suggested Pattern - Technician
                      </div>

                      <div className="card-body m-0 p-1">
                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Brand</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={suggestedPattern?.brand || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row mb-1">
                          <div className="col-5 fw-semibold">Pattern</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={suggestedPattern?.patternName || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-5 fw-semibold">Width</div>
                          <div className="col-7">
                            <input
                              type="text"
                              className="form-control"
                              value={suggestedPattern?.width ?? ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* APPROVED PATTERN CHANGE */}
                <div className="card mt-1">
                  <div className="card-header fw-bold">
                    Approved Pattern Change
                  </div>

                  <div className="card-body">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={changeRequestedPattern}
                        onChange={async (e) => {
                          const checked = e.target.checked;
                          setChangeRequestedPattern(checked);

                          if (!checked) {
                            // Preserve the bound values; only disable editing.
                            return;
                          }

                          // Load variants for the currently selected pattern.
                          if (!selectedPattern) return;

                          try {
                            setLoadingPatternVariants(true);

                            const response =
                              await holdTyreServiceApi.getTreadPatternVariants(
                                Number(selectedPattern),
                              );

                            if (response?.data?.success) {
                              const patternData = response.data.data?.[0];
                              setPatternVariants(patternData?.variants || []);
                              setSelectedBrand(
                                patternData?.brand || selectedBrand,
                              );
                            } else {
                              setPatternVariants([]);
                            }
                          } catch (error) {
                            console.error(
                              "Failed to load pattern variants:",
                              error,
                            );
                            setPatternVariants([]);
                          } finally {
                            setLoadingPatternVariants(false);
                          }
                        }}
                        id="changeRequestedPattern"
                      />

                      <label
                        className="form-check-label fw-bold"
                        htmlFor="changeRequestedPattern"
                      >
                        Change Requested Pattern
                      </label>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Pattern
                        </label>

                        <select
                          className="form-select"
                          value={selectedPattern}
                          disabled={
                            !changeRequestedPattern || loadingPatternSuggestions
                          }
                          onChange={async (e) => {
                            const patternId = e.target.value;

                            setSelectedPattern(patternId);

                            // Reset previous values and validation status
                            setSelectedWidth("");
                            setSelectedBrand("");
                            setPatternVariants([]);
                            setIsFinishedMaterialValid(null);
                            setMaterialValidationMessage("");

                            if (!patternId) {
                              return;
                            }

                            // Find the selected pattern in the master list first,
                            // then fall back to the suggested pattern.
                            const selectedPatternData = patternSuggestions.find(
                              (pattern) =>
                                String(pattern.treadPatternId) === patternId,
                            );

                            const patternName =
                              selectedPatternData?.patternName ||
                              (String(suggestedPattern?.treadPatternId) ===
                              patternId
                                ? suggestedPattern?.patternName
                                : "");

                            const tyreSize =
                              casingDetails?.tyreSize?.casingSize;

                            if (tyreSize && patternName) {
                              void checkFinishedMaterial(tyreSize, patternName);
                            }

                            try {
                              setLoadingPatternVariants(true);

                              const response =
                                await holdTyreServiceApi.getTreadPatternVariants(
                                  Number(patternId),
                                );

                              console.log(
                                "SELECTED TREAD PATTERN VARIANTS:",
                                response,
                              );

                              if (response?.data?.success) {
                                const patternData = response.data.data?.[0];
                                const variants = patternData?.variants || [];

                                setPatternVariants(variants);
                                setSelectedBrand(
                                  patternData?.brand ||
                                    selectedPatternData?.brand ||
                                    (String(
                                      suggestedPattern?.treadPatternId,
                                    ) === patternId
                                      ? suggestedPattern?.brand
                                      : "") ||
                                    "",
                                );

                                // Keep the suggested width if it exists in the
                                // variants for the selected pattern.
                                if (
                                  String(suggestedPattern?.treadPatternId) ===
                                    patternId &&
                                  variants.some(
                                    (variant: any) =>
                                      String(variant.width) ===
                                      String(suggestedPattern?.width),
                                  )
                                ) {
                                  setSelectedWidth(
                                    String(suggestedPattern?.width),
                                  );
                                }
                              } else {
                                setPatternVariants([]);
                                setSelectedBrand("");
                              }
                            } catch (error) {
                              console.error(
                                "Failed to load tread pattern variants:",
                                error,
                              );

                              setPatternVariants([]);
                              setSelectedBrand("");
                            } finally {
                              setLoadingPatternVariants(false);
                            }
                          }}
                        >
                          <option value="">
                            {loadingPatternSuggestions
                              ? "Loading Patterns..."
                              : "Select Pattern"}
                          </option>

                          {/* Fallback: show the suggested pattern if it is
        missing from the master patterns API response. */}
                          {suggestedPattern &&
                            !patternSuggestions.some(
                              (pattern) =>
                                Number(pattern.treadPatternId) ===
                                Number(suggestedPattern.treadPatternId),
                            ) && (
                              <option
                                value={String(suggestedPattern.treadPatternId)}
                              >
                                {suggestedPattern.brand} -{" "}
                                {suggestedPattern.patternName}
                              </option>
                            )}

                          {patternSuggestions.map((pattern) => (
                            <option
                              key={pattern.treadPatternId}
                              value={String(pattern.treadPatternId)}
                            >
                              {pattern.brand} - {pattern.patternName}
                            </option>
                          ))}
                        </select>

                        {isValidatingMaterial && (
                          <small className="text-muted d-block mt-1">
                            Validating finished material...
                          </small>
                        )}

                        {!isValidatingMaterial &&
                          isFinishedMaterialValid === true && (
                            <small className="text-success d-block mt-1">
                              Finished material validated successfully.
                            </small>
                          )}

                        {!isValidatingMaterial &&
                          isFinishedMaterialValid === false && (
                            <small className="text-danger d-block mt-1">
                              {materialValidationMessage}
                            </small>
                          )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Width</label>

                        <select
                          className="form-select"
                          value={selectedWidth}
                          onChange={(e) => setSelectedWidth(e.target.value)}
                          disabled={
                            !changeRequestedPattern ||
                            !selectedPattern ||
                            loadingPatternVariants
                          }
                        >
                          <option value="">
                            {loadingPatternVariants
                              ? "Loading Widths..."
                              : "Select Width"}
                          </option>

                          {/* Fallback: show the suggested width if it is
        missing from the loaded variants. */}
                          {suggestedPattern &&
                            String(suggestedPattern.treadPatternId) ===
                              String(selectedPattern) &&
                            !patternVariants.some(
                              (variant: any) =>
                                String(variant.width) ===
                                String(suggestedPattern.width),
                            ) && (
                              <option value={String(suggestedPattern.width)}>
                                {suggestedPattern.width}
                              </option>
                            )}

                          {patternVariants.map((variant: any) => (
                            <option
                              key={variant.treadPatternVariantId}
                              value={String(variant.width)}
                            >
                              {variant.width}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Brand</label>

                        <input
                          type="text"
                          className="form-control"
                          value={selectedBrand}
                          readOnly
                          disabled={!changeRequestedPattern}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HOLD REASON / COMMENTS */}
                <div className="row g-3 mb-1">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold">
                      Hold Reason
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        suggestedPattern?.rejectionReason ||
                        selectedItem?.holdReason ||
                        ""
                      }
                      readOnly
                    />
                  </div>

                  <div className="col-md-7">
                    <label className="form-label fw-semibold">Comments</label>

                    <textarea
                      className="form-control"
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>

                {/* =================================================
                  ACTION BUTTONS
            ================================================== */}
                <div className="row g-3">
                  {/* APPROVE */}
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-approve w-100 h-100"
                      style={{
                        // background: "linear-gradient(135deg, #28a745, #26a369)",
                        height: "100%",
                      }}
                      onClick={handleApprove}
                    >
                      <b>APPROVED</b>
                    </button>
                  </div>

                  {/* REJECT */}
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-reject w-100 h-100"
                      style={{
                        height: "100%",
                      }}
                      onClick={handleReject}
                    >
                      <b>REJECTED</b>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreBuffingPatternApprovalModal;
