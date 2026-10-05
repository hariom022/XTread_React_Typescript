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

  const [hasSearched, setHasSearched] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [searchCriteria, setSearchCriteria] =
    useState<CustomerSearchRequest | null>(null);

  const [showReview, setShowReview] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

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

      setHasSearched(true);
    } catch {
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
  // SAVE
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

      // Close Review popup
      setShowReview(false);

      // Open Success popup
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
  // ADD ANOTHER
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
  // NEXT STEP
  // ==========================================

  const handleNextStep = () => {
    setShowSuccess(false);

    setSelectedCustomer(null);
    clearResults();

    navigate("/customer-form");
  };

  return (
    <div className="container-fluid">

      {/* SEARCH FORM */}

      <CustomerSearchForm
        loading={loading}
        onSearch={handleSearch}
      />

      {/* SEARCH ERROR */}

      {hasSearched && error && (
        <div className="alert alert-danger mt-4">
          <i className="bi bi-exclamation-triangle me-2"></i>

          {error}
        </div>
      )}

      {/* SEARCH RESULTS */}

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

      {/* REVIEW POPUP */}

      <CustomerReview
        show={showReview}
        customer={selectedCustomer}
        loading={loading}
        error={saveError}
        onBack={handleBackToResults}
        onSave={handleSaveCustomer}
      />

      {/* SUCCESS POPUP */}

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