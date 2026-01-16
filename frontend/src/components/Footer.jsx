import "./Footer.css";
import { footerData } from "../data/footerData";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footerInner">
        <div className="footerTop">
          <div className="footerBrand" aria-label="Brand">
            <div className="footerBrandRow">
              {footerData.brand.logoSrc ? (
                <img
                  className="footerLogo"
                  src={footerData.brand.logoSrc}
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
              <div className="footerBrandText">
                <div className="footerBrandName">{footerData.brand.name}</div>
                {footerData.brand.tagline ? (
                  <div className="footerTagline">
                    {footerData.brand.tagline}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="footerSocial" aria-label="Social links">
            <a
              className="footerIconBtn"
              href={footerData.socials.instagram}
              aria-label="Instagram"
            >
              <FontAwesomeIcon className="footerIcon" icon={faInstagram} />
            </a>
            <a
              className="footerIconBtn"
              href={footerData.socials.linkedin}
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon className="footerIcon" icon={faLinkedinIn} />
            </a>
            <a
              className="footerIconBtn"
              href={footerData.socials.twitter}
              aria-label="Twitter"
            >
              <FontAwesomeIcon className="footerIcon" icon={faXTwitter} />
            </a>
            <a
              className="footerIconBtn"
              href={footerData.socials.email}
              aria-label="Email"
            >
              <FontAwesomeIcon className="footerIcon" icon={faEnvelope} />
            </a>
          </div>
        </div>

        <div className="footerLinks" aria-label="Policy links">
          <Link to="/code-of-conduct" className="footerPolicyLink">
            Code of Conduct
          </Link>
          <span className="footerLinkDivider">|</span>
          <Link to="/refund-policy" className="footerPolicyLink">
            Refund Policy
          </Link>
        </div>

        <div className="footerBottom">
          <div className="footerCopyright">
            © {year} {footerData.brand.name}. All rights reserved.
          </div>
          <div className="footerDeveloper">
            Developed with <span className="footerHeart">♥</span> by{" "}
            <span className="footerTeamName">Team Hobiverse</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
