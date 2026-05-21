import "./Header.css";

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
        <span className="person">👤</span>
      </div>
    </div>
  );
};

export default Header;