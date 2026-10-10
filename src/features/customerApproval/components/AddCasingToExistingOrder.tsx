import { useState } from "react";

import CollectionPage from "../../collection/page/CollectionPage";

import ExistingOrderHeader from "./ExistingOrderHeader";

import type { AddCasingToExistingOrderProps } from "../types/addCasing.types";

const AddCasingToExistingOrder = ({
  existingOrder,
  onClose,
  onSuccess,
  setLoading,
}: AddCasingToExistingOrderProps) => {
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <div>
      <ExistingOrderHeader order={existingOrder} />

      <CollectionPage
        key={existingOrder.orderNumber}
        addToExistingOrder={true}
        existingOrder={existingOrder}
        onClose={onClose}
        onSuccess={async () => {
          setSubmitting(false);
          setLoading(false);
          await onSuccess();
        }}
        onSubmittingChange={(isSubmitting: boolean) => {
          setSubmitting(isSubmitting);
          setLoading(isSubmitting);
        }}
        hideLayout={false}
      />

      {submitting && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.5)",
            zIndex: 10,
          }}
        >
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Saving casing...</span>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleClose}
          disabled={submitting}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddCasingToExistingOrder;
