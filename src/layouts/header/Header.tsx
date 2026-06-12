import "./Header.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/services/authService";

type HeaderProps = {
  toggleSidebar?: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="header">
      <div
        className="left"
        style={{ display: "flex", alignItems: "center" }}
      >
        <img
          src="https://ax-webassets.lon1.cdn.digitaloceanspaces.com/static/original_images/Logo.png"
          alt="Logo"
          height={40}
          width={120}
        />
      </div>

      <div className="right">
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;