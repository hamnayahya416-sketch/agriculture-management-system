import { Link } from "react-router-dom";
import { IconLeaf } from "./icons";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/crops", label: "Crops" },
  { to: "/harvest-orders", label: "Harvest" },
  { to: "/buyers", label: "Buyers" },
  { to: "/reports", label: "Reports" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <IconLeaf size={16} />
        <span>
          © 2026 <b>AgriCore</b>. All rights reserved.
        </span>
      </div>

      <nav className="footer__links" aria-label="Footer navigation">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>

      <span className="footer__tag">Smart Agriculture Management System</span>
    </footer>
  );
}
