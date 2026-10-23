import { IconLeaf } from "./icons";

const LINKS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "supplies", label: "Supplies" },
  { id: "orders", label: "Orders" },
  { id: "form", label: "New Order" },
];

export default function Footer({ setPage }) {
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
          <button key={link.id} type="button" onClick={() => setPage(link.id)}>
            {link.label}
          </button>
        ))}
      </nav>

      <span className="footer__tag">Smart Agriculture Management System</span>
    </footer>
  );
}
