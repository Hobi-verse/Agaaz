import "./Footer.css";
import { footerData } from "../data/footerData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getVisitCount, incrementVisitCount } from "../services/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const [visitCount, setVisitCount] = useState(null);
  const [visitStatus, setVisitStatus] = useState("loading");

  useEffect(() => {
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

    const run = async ({ allowIncrement }) => {
      const now = Date.now();
      const storageKey = "arambh:lastVisitCountedAt";

      setVisitStatus("loading");

      try {
        const lastCountedRaw = window?.localStorage?.getItem(storageKey);
        const lastCountedAt = lastCountedRaw ? Number(lastCountedRaw) : 0;
        const shouldIncrement =
          allowIncrement &&
          Number.isFinite(lastCountedAt) &&
          now - lastCountedAt >= THREE_HOURS_MS;

        // If we've never counted before, count the first visit.
        const firstTime = !lastCountedRaw;

        const result =
          firstTime || shouldIncrement
            ? await incrementVisitCount()
            : await getVisitCount();

        if (result?.success && typeof result.count === "number") {
          setVisitCount(result.count);
          setVisitStatus("ok");
          if (firstTime || shouldIncrement) {
            window?.localStorage?.setItem(storageKey, String(now));
          }
        } else {
          setVisitStatus("error");
        }
      } catch {
        // Silently ignore counter failures (footer should never break page)
        setVisitStatus("error");
      }
    };

    // On mount: allow increment based on the 3-hour rule
    run({ allowIncrement: true });

    // Keep footer fresh: re-fetch (and potentially increment) every 3 hours
    const intervalId = window.setInterval(() => {
      run({ allowIncrement: true });
    }, THREE_HOURS_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

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
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon className="footerIcon" icon={faInstagram} />
            </a>
            <a
              className="footerIconBtn"
              href={footerData.socials.twitter}
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
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
          <span className="footerLinkDivider">|</span>
          <span className="footerPolicyLink">
            For any technical issue contact:{" "}
            <a href="tel:8127155421">8127155421</a>
          </span>
        </div>

        <div className="footerBottom">
          <div className="footerCopyright">
            © {year} {footerData.brand.name}. All rights reserved.
          </div>
          <div className="footerVisits" aria-label="Website visits">
            Visits:{" "}
            {visitStatus === "ok" && typeof visitCount === "number" ? (
              <span className="footerVisitsValue">{visitCount}</span>
            ) : visitStatus === "loading" ? (
              <span className="footerVisitsValue">Loading…</span>
            ) : (
              <span className="footerVisitsValue">Unavailable</span>
            )}
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
