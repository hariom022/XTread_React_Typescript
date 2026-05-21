import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar" style={{ position: "fixed" }}>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            <i className="bi bi-bar-chart-line-fill"></i> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/collection">
            <i className="bi bi-collection-fill"></i> Collection
          </NavLink>
        </li>
        <li>
          <NavLink to="/customerApproval" end>
            <i className="bi bi-person-check-fill"></i> Customer Approval
          </NavLink>
        </li>
        <li>
          <NavLink to="/receiving">
            <i className="bi bi-file-arrow-down-fill"></i> Receiving
          </NavLink>
        </li>

        <li>
          <NavLink to="/visualinspection">
            <i className="bi bi-eye-fill"></i> Visual Inspection
          </NavLink>
        </li>

        <li>
          <NavLink to="/nailinspection">
            <i className="bi bi-clipboard-check-fill"></i> Nail Inspection
          </NavLink>
        </li>

        <li>
          <NavLink to="/pressuretest">
            <i className="bi bi-speedometer2"></i> Pressure Test
          </NavLink>
        </li>

        <li>
          <NavLink to="/shearography">
            <i className="bi bi-soundwave"></i> Shearography
          </NavLink>
        </li>

        <li>
          <NavLink to="/buffing">
            <i className="bi bi-brush-fill"></i> Buffing Stage
          </NavLink>
        </li>
        <li>
          <NavLink to="/skiving">
            <i className="bi bi-gear-wide-connected"></i> Skiving Stage
          </NavLink>
        </li>
        <li>
          <NavLink to="/cementing">
            <i className="bi bi-wrench"></i> Cementing
          </NavLink>
        </li>
        <li>
          <NavLink to="/treadbench">
            <i className="bi bi-tools"></i> Tread Bench (Cutting)
          </NavLink>
        </li>
        <li>
          <NavLink to="/repairs">
            <i className="bi bi-patch-check-fill"></i> Repairs Stage
          </NavLink>
        </li>
        <li>
          <NavLink to="/fillup">
            <i className="bi bi-file-arrow-up-fill"></i> Fill Up Stage
          </NavLink>
        </li>

        <li>
          <NavLink to="/building">
            <i className="bi bi-building-fill"></i> Building Stage
          </NavLink>
        </li>
        <li>
          <NavLink to="/enveloping">
            <i className="bi bi-envelope-fill"></i> Enveloping
          </NavLink>
        </li>
        <li>
          <NavLink to="/curing">
            <i className="bi bi-gear-fill"></i> Curing
          </NavLink>
        </li>
        <li>
          <NavLink to="/qualityInspect">
            <i className="bi bi-check-circle-fill"></i> Quality Control
          </NavLink>
        </li>
        <li>
          <NavLink to="/dispatch">
            <i className="bi bi-arrow-up-right-square-fill"></i> Dispatch
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
