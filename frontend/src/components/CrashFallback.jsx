import "../pages/NotFound/NotFound.css";

export default function CrashFallback() {
  return (
    <main className="nfWrap nfWrapFull" aria-label="Error page">
      <section className="nfCard">
        <div className="nfCode" aria-hidden="true">
          Error
        </div>
        <h1 className="nfTitle">Something went wrong</h1>
        <p className="nfSubtitle">
          The website encountered an unexpected error. Please try reloading.
        </p>

        <div className="nfActions">
          <button
            type="button"
            className="nfBtn"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <a className="nfBtn nfBtnSecondary" href="/">
            Go to Home
          </a>
        </div>

        <div className="nfHelp" aria-label="Help contacts">
          <div className="nfHelpTitle">If this persists, contact:</div>
          <div className="nfHelpRow">
            <span className="nfHelpName">Ayush Singh</span>
            <a className="nfHelpLink" href="tel:7081832092">
              7081832092
            </a>
          </div>
          <div className="nfHelpRow">
            <span className="nfHelpName">Aman Singh Nishad</span>
            <a className="nfHelpLink" href="tel:7340981852">
              7340981852
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
