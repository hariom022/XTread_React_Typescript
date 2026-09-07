import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const login = useAuthStore(
    (state) => state.login
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const [emailOrUserName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  /**
   * If already logged in,
   * don't show Login page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!emailOrUserName.trim()) {
      setError("Please enter username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter password.");
      return;
    }

    try {
      await login(emailOrUserName, password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Invalid username or password."
      );
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
                value={emailOrUserName}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;