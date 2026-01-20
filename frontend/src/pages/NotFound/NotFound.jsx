import "./NotFound.css";
import { Link, useLocation } from "react-router-dom";

export default function NotFound({ variant = "notfound" }) {
  const location = useLocation();

  const isError = variant === "error";
  const code = isError ? "Error" : "404";
  const title = isError ? "Something went wrong" : "Page not found";
  const subtitle = isError
    ? "The site ran into an unexpected problem while loading this page."
    : "The page you’re looking for doesn’t exist, or the link is incorrect.";

  return (
    <main className="nfWrap" aria-label={isError ? "Error page" : "404 page"}>
      <section className="nfCard">
        <div className="nfCode" aria-hidden="true">
          {code}
        </div>
        <h1 className="nfTitle">{title}</h1>
        <p className="nfSubtitle">{subtitle}</p>

        {!isError ? (
          <p className="nfPath" aria-label="Requested path">
            {location?.pathname}
          </p>
        ) : null}

        <div className="nfActions">
          <Link className="nfBtn" to="/">
            Go to Home
          </Link>
          <button
            type="button"
            className="nfBtn nfBtnSecondary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>

        <div className="nfHelp" aria-label="Help contacts">
          <div className="nfHelpTitle">
            If this looks like an error, contact:
          </div>
          <div className="nfHelpRow">
            <span className="nfHelpName">Ayush Singh</span>
            <a className="nfHelpLink" href="tel:7081832092">
              7081832092
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
