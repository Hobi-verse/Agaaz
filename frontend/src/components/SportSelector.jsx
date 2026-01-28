// SportSelector - Dropdown component to select sport category and event
import { useState } from "react";
import {
  sportsData,
  getSportById,
  getSportTypeLabel,
} from "../data/sportsData";

const SportSelector = ({ onSportSelect, selectedSport }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSportId, setSelectedSportId] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");

  // Sports to exclude from registration (registration closed for these)
  const excludedSportIds = ['cricket'];

  const availableSports = selectedCategory
    ? (sportsData.find((cat) => cat.id === selectedCategory)?.sports || [])
      .filter((sport) => !excludedSportIds.includes(sport.id))
    : [];

  const currentSport = availableSports.find((s) => s.id === selectedSportId);
  const hasSubTypes =
    currentSport?.hasSubTypes && currentSport?.subTypes?.length > 0;

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSportId("");
    setSelectedSubType("");
    onSportSelect(null);
  };

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSportId(sportId);
    setSelectedSubType("");

    const sport = availableSports.find((s) => s.id === sportId);
    if (!sport?.hasSubTypes) {
      const fullSport = getSportById(sportId);
      onSportSelect(fullSport);
    } else {
      onSportSelect(null);
    }
  };

  const handleSubTypeChange = (e) => {
    const subTypeId = e.target.value;
    setSelectedSubType(subTypeId);

    if (subTypeId) {
      const fullSport = getSportById(subTypeId);
      onSportSelect(fullSport);
    } else {
      onSportSelect(null);
    }
  };

  return (
    <div className="sport-selector">
      <h2>Select Your Sport</h2>

      {/* Category Selection */}
      <div className="selector-field">
        <label>
          Sport Category <span style={{ color: "#ff6b6b" }}>*</span>
        </label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">-- Select Category --</option>
          {sportsData.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sport Selection */}
      {selectedCategory && (
        <div className="selector-field">
          <label>
            Select Event <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <select value={selectedSportId} onChange={handleSportChange}>
            <option value="">-- Select Event --</option>
            {availableSports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name} - {getSportTypeLabel(sport.type)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-type Selection */}
      {hasSubTypes && (
        <div className="selector-field">
          <label>
            Select Type <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <select value={selectedSubType} onChange={handleSubTypeChange}>
            <option value="">-- Select Type --</option>
            {currentSport.subTypes.map((subType) => (
              <option key={subType.id} value={subType.id}>
                {subType.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Sport Info */}
      {selectedSport && (
        <div className="selected-sport-card">
          <div className="selected-sport-titleRow">
            <h3 className="selected-sport-title">{selectedSport.name}</h3>
            <span className="sport-type-badge">
              {getSportTypeLabel(selectedSport.type)}
            </span>
          </div>
          <p className="selected-sport-desc">{selectedSport.description}</p>
          {selectedSport.teamSize > 1 && (
            <p className="selected-sport-meta">
              Team Size: {selectedSport.teamSize} players
            </p>
          )}
          <p className="selected-sport-fee">
            Registration Fee: ₹{selectedSport.fee}
          </p>
        </div>
      )}
    </div>
  );
};

export default SportSelector;
