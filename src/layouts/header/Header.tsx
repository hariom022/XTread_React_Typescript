import "./Header.css";
import { Link } from "react-router-dom";
type HeaderProps = {
  toggleSidebar?: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
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
        <Link to="/" >
         <span className="person">👤</span>
        </Link>
       
      </div>
    </div>
  );
};

export default Header;