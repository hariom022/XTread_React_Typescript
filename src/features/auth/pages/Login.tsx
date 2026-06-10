import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = login(username, password);

    if (isValid) {
      navigate("/dashboard");
    } else {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">
            XTread Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Username
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>

            {/* <div className="mt-3 text-center">
              <small>
                Username: admin <br />
                Password: 12345
              </small>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;