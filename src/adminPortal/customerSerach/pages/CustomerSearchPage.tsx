import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerSearchForm from "../components/CustomerSearchForm";
import CustomerSearchResults from "../components/CustomerSearchResults";
import CustomerReview from "../components/CustomerReview";
import CustomerSuccess from "../components/CustomerSuccess";

import useCustomerSearch from "../hooks/useCustomerSearch";

import type {
  Customer,
  CustomerSearchRequest,
} from "../types/customerSearch.type";

const CustomerSearchPage = () => {
  const navigate = useNavigate();

  const {
    searchCustomers,
    saveCustomer,
    customerList,
    loading,
    error,
    clearResults,
  } = useCustomerSearch();

  // ==========================================
  // SEARCH HAS BEEN PERFORMED
  // ==========================================

  const [hasSearched, setHasSearched] =
    useState(false);

  // ==========================================
  // SELECTED CUSTOMER
  // ==========================================

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  // ==========================================
  // SEARCH CRITERIA
  // ==========================================

  const [searchCriteria, setSearchCriteria] =
    useState<CustomerSearchRequest | null>(null);

  // ==========================================
  // REVIEW POPUP
  // ==========================================

  const [showReview, setShowReview] =
    useState(false);

  // ==========================================
  // SUCCESS POPUP
  // ==========================================

  const [showSuccess, setShowSuccess] =
    useState(false);

  // ==========================================
  // SAVE ERROR
  // ==========================================

  const [saveError, setSaveError] =
    useState<string | null>(null);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = async (
    payload: CustomerSearchRequest,
  ) => {
    setSelectedCustomer(null);
    setSaveError(null);
    setSearchCriteria(payload);

    try {
      await searchCustomers(payload);

      // Results section appears directly below
      // Customer Search form.
      setHasSearched(true);
    } catch (err) {
      setHasSearched(true);
    }
  };

  // ==========================================
  // SELECT CUSTOMER
  // ==========================================

  const handleSelectCustomer = (
    customer: Customer,
  ) => {
    setSelectedCustomer(customer);
    setSaveError(null);
  };

  // ==========================================
  // MODIFY SEARCH
  // ==========================================

  const handleModifySearch = () => {
    setHasSearched(false);
    setSelectedCustomer(null);
    setSearchCriteria(null);
    setSaveError(null);

    clearResults();
  };

  // ==========================================
  // CONTINUE
  // ==========================================

  const handleContinue = () => {
    if (!selectedCustomer) {
      return;
    }

    // Search results remain on page,
    // but Review opens as popup.
    setSaveError(null);
    setShowReview(true);
  };

  // ==========================================
  // BACK TO RESULTS
  // ==========================================

  const handleBackToResults = () => {
    setShowReview(false);
    setSaveError(null);
  };

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  const handleSaveCustomer = async () => {
    if (!selectedCustomer) {
      return;
    }

    try {
      setSaveError(null);

      const response =
        await saveCustomer(selectedCustomer);

      if (!response.success) {
        setSaveError(response.message);
        return;
      }

      /*
       * IMPORTANT:
       *
       * 1. Close Review popup
       * 2. Open Success popup
       */

      setShowReview(false);
      setShowSuccess(true);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Unable to save customer.",
      );
    }
  };

  // ==========================================
  // ADD ANOTHER CUSTOMER
  // ==========================================

  const handleAddAnother = () => {
    setShowSuccess(false);
    setShowReview(false);

    setHasSearched(false);
    setSelectedCustomer(null);
    setSearchCriteria(null);
    setSaveError(null);

    clearResults();
  };

  // ==========================================
  // GO TO NEXT STEP
  // ==========================================

  const handleNextStep = () => {
    // Close success popup
    setShowSuccess(false);

    setSelectedCustomer(null);
    clearResults();

    /*
     * Replace this route with the route
     * of your existing/current Customer Form.
     */

    navigate("/customer-form");
  };

  return (
    <div className="container-fluid">

      {/* ========================================
          STEP 1
      ======================================== */}

      <CustomerSearchForm
        loading={loading}
        onSearch={handleSearch}
      />

      {/* ========================================
          SEARCH ERROR
      ======================================== */}

      {hasSearched && error && (
        <div className="alert alert-danger mt-4">
          <i className="bi bi-exclamation-triangle me-2"></i>

          {error}
        </div>
      )}

      {/* ========================================
          STEP 2
          DIRECTLY BELOW SEARCH FORM
      ======================================== */}

      {hasSearched &&
        searchCriteria && (
          <CustomerSearchResults
            customers={customerList}
            selectedCustomer={selectedCustomer}
            searchValue={[
              searchCriteria.sapNumber
                ? `SAP Number: ${searchCriteria.sapNumber}`
                : null,

              searchCriteria.customerName
                ? `Customer Name: ${searchCriteria.customerName}`
                : null,
            ]
              .filter(Boolean)
              .join(" | ")}
            loading={loading}
            onSelectCustomer={
              handleSelectCustomer
            }
            onModifySearch={
              handleModifySearch
            }
            onContinue={handleContinue}
          />
        )}

      {/* ========================================
          STEP 3 - REVIEW POPUP
      ======================================== */}

      <CustomerReview
        show={showReview}
        customer={selectedCustomer}
        loading={loading}
        error={saveError}
        onBack={handleBackToResults}
        onSave={handleSaveCustomer}
      />

      {/* ========================================
          STEP 4 - SUCCESS POPUP
      ======================================== */}

      <CustomerSuccess
        show={showSuccess}
        customer={selectedCustomer}
        onAddAnother={handleAddAnother}
        onNextStep={handleNextStep}
      />

    </div>
  );
};

export default CustomerSearchPage;