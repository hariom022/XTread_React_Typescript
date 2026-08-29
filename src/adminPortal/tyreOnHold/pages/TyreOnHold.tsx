import { RingLoader } from "react-spinners";

import HoldTyreIndexPage from "../components/holdTyreIndexPage";
import { useHoldTyreIndexPage } from "../hooks/useHoldTyreIndexPage";
import { useState } from "react";
import HoldTyreApprovalModal from "../components/holdTyreApprovalModal";

const TyreOnHold = () => {

    const {
        loading,
        search,
        setSearch,
        filteredHoldTyres,
    } = useHoldTyreIndexPage();

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const handleInspect = (item: any) => {
        console.log("Selected HOLD casing:", item);

        setSelectedItem(item);
        setShowApprovalModal(true);
    };

    const closeApprovalModal = () => {
        setShowApprovalModal(false);
        setSelectedItem(null);
    };

    return (
        <div className="container-fluid mt-3">

            {/* SEARCH */}
            <div className="row mb-3">
                <div className="col-md-10">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>
            </div>

            {/* TABLE */}
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <RingLoader size={80} />
                </div>
            ) : (
                <HoldTyreIndexPage
                    data={filteredHoldTyres}
                    onInspect={handleInspect}
                />
            )}
                {/* APPROVAL MODAL */}
                {selectedItem && (
                <HoldTyreApprovalModal
                    selectedItem={selectedItem}
                    onClose={closeApprovalModal}
                />
            )}

        </div>
    );
};

export default TyreOnHold;