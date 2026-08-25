import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100%",
        minHeight: "500px",
      }}
    >
      <h1 className="text-danger">
        403
      </h1>

      <h3>
        Access Denied
      </h3>

      <p className="text-muted">
        You do not have permission to
        access this module.
      </p>

      <button
        className="btn btn-primary"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default AccessDenied;