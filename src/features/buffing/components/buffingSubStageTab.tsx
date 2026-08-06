type Props = {
    activeTab: "pre" | "post";

    setActiveTab: (
        tab: "pre" | "post",
    ) => void;
};

const BuffingSubStageTab = ({
    activeTab,
    setActiveTab,
}: Props) => {
    return (
        <div className="d-flex gap-2 mb-3">
            <button
                className={`btn ${activeTab === "pre"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                onClick={() =>
                    setActiveTab("pre")
                }
            >
                Pre Buffing
            </button>

            <button
                className={`btn ${activeTab === "post"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                onClick={() =>
                    setActiveTab("post")
                }
            >
                Post Buffing
            </button>
        </div>
    );
};

export default BuffingSubStageTab;