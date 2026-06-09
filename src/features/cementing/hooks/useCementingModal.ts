import { useState } from "react";

export const useCementingModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false);

 const openModal = async (item: any) => {
  try {
    setLoadingModal(true);

    // If you want to call an API to get details,
    // do it here.

    setSelectedItem(item);
    setShowModal(true);
  } catch (err) {
    console.error(err);
    alert("Failed to load details");
  } finally {
    setLoadingModal(false);
  }
};
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return {
    showModal,
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  };
};