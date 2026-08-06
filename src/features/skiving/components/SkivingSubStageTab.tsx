
type Props = {
    activeTab: "skiving" | "approval";

    setActiveTab: (
        tab: "skiving" | "approval"
    ) => void;
};

const SkivingSubStageTab = ({
    activeTab,
    setActiveTab,
}: Props) => {
    return (
        <div className="d-flex gap-2 mb-3">

            <button
                type="button"
                className={`btn ${activeTab === "skiving"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                onClick={() =>
                    setActiveTab("skiving")
                }
            >
                Skiving Stage 1
            </button>

            <button
                type="button"
                className={`btn ${activeTab === "approval"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                onClick={() =>
                    setActiveTab("approval")
                }
            >
                Skiving Approval
            </button>

        </div>
    );
};

export default SkivingSubStageTab;