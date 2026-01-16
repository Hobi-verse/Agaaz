import { useNavigate } from "react-router-dom";
import { sportsData } from "../../data/sportsData";
import Button from "../../components/Button";
import "./AllSports.css";
import { useEffect } from "react";

const buildCategoryRows = (category) =>
  category.sports.flatMap((sport) =>
    sport.hasSubTypes &&
    Array.isArray(sport.subTypes) &&
    sport.subTypes.length > 0
      ? sport.subTypes.map((subType) => ({ ...subType }))
      : [{ ...sport }]
  );

export default function AllSports() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="allSportsPage">
      <header className="allSportsHeader">
        <h1 className="allSportsTitle">ALL SPORTS & EVENTS</h1>
        <p className="allSportsSubtitle">
          Explore sports categories and view rules & regulations
        </p>
      </header>

      <div className="allSportsContent">
        {sportsData.map((category) => {
          const rows = buildCategoryRows(category);

          return (
            <section key={category.id} className="allSportsCategory">
              <div className="allSportsCategoryHeader">
                <h2 className="allSportsCategoryName">{category.name}</h2>
                <p className="allSportsCategoryDesc">{category.description}</p>
              </div>

              <div className="scrollHintMobile">
                <span>Scroll right →</span>
              </div>

              <div
                className="sportsTableWrap"
                role="region"
                aria-label={`${category.name} events`}
              >
                <table className="sportsTable">
                  <thead>
                    <tr>
                      <th scope="col">Event</th>
                      <th scope="col">Type</th>
                      <th scope="col">Team Size</th>
                      <th scope="col">Fee</th>
                      <th scope="col" className="sportsTableColAction">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((sport) => (
                      <tr key={sport.id}>
                        <td>
                          <div className="sportsTableEventName">
                            {sport.name}
                          </div>
                          {sport.genderRestriction && (
                            <div className="sportsTableEventMeta">
                              {sport.genderRestriction === "female"
                                ? "Girls only"
                                : "Boys only"}
                            </div>
                          )}
                        </td>
                        <td className="sportsTableType">
                          {String(sport.type).toUpperCase().replace("_", " ")}
                        </td>
                        <td className="sportsTableTeam">
                          {sport.teamSize}{" "}
                          {sport.teamSize === 1 ? "Player" : "Players"}
                        </td>
                        <td className="sportsTableFee">₹{sport.fee}</td>
                        <td className="sportsTableColAction">
                          <Button
                            className="sportsTableActionBtn"
                            onClick={() => navigate(`/sport/${sport.id}`)}
                          >
                            View Rules
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <div className="allSportsFooterActions">
          <Button
            className="sportsPrimaryBtn"
            onClick={() => navigate("/register")}
          >
            Register Now
          </Button>
        </div>
      </div>
    </main>
  );
}
