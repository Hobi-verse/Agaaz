import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useId, useRef, useState } from "react";
const logo = "/aagaaz-logo.png";
import Banner from "./Banner";

const defaultLinks = [
  { label: "About", href: "#about" },
  { label: "Sports", href: "#sports" },
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ links = defaultLinks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const navRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const onPointerDown = (e) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="navShell">
      <nav ref={navRef} className="navPill" aria-label="Primary">
        <div className="navInner">
          <Link className="brand" to="/" aria-label="AAGAAZ">
            <img className="brandLogo" src={logo} alt="" aria-hidden="true" />
            <div className="brandContainer">
              <span className="brandText" aria-hidden="true">
                AAGAAZ
              </span>
              <span className="tagLine">Play, Progress, Prosper</span>
            </div>
          </Link>

          <button
            type="button"
            className="navToggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg
                className="navToggleIcon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="navToggleIcon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div className="navLinks navLinksDesktop">
            {links.map((item) =>
              item.to ? (
                <Link key={item.label} className="navLink" to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} className="navLink" href={item.href}>
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>

        <div
          id={menuId}
          className={`navMobileMenu ${menuOpen ? "isOpen" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="navMobileLinks" role="menu">
            {links.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  className="navMobileLink"
                  to={item.to}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  className="navMobileLink"
                  href={item.href}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>
      </nav>{" "}
      <Banner />
    </header>
  );
}
