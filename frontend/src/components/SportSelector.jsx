// SportSelector - Dropdown component to select sport category and event
import { useState } from 'react';
import { sportsData, getSportById, getSportTypeLabel } from '../data/sportsData';

const SportSelector = ({ onSportSelect, selectedSport }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSportId, setSelectedSportId] = useState('');
    const [selectedSubType, setSelectedSubType] = useState('');

    const availableSports = selectedCategory
        ? sportsData.find(cat => cat.id === selectedCategory)?.sports || []
        : [];

    const currentSport = availableSports.find(s => s.id === selectedSportId);
    const hasSubTypes = currentSport?.hasSubTypes && currentSport?.subTypes?.length > 0;

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSportId('');
        setSelectedSubType('');
        onSportSelect(null);
    };

    const handleSportChange = (e) => {
        const sportId = e.target.value;
        setSelectedSportId(sportId);
        setSelectedSubType('');

        const sport = availableSports.find(s => s.id === sportId);
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
            <h2>🏆 Select Your Sport</h2>

            {/* Category Selection */}
            <div className="selector-field">
                <label>Sport Category <span style={{ color: 'red' }}>*</span></label>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">-- Select Category --</option>
                    {sportsData.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sport Selection */}
            {selectedCategory && (
                <div className="selector-field">
                    <label>Select Event <span style={{ color: 'red' }}>*</span></label>
                    <select value={selectedSportId} onChange={handleSportChange}>
                        <option value="">-- Select Event --</option>
                        {availableSports.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                                {sport.name} ({getSportTypeLabel(sport.type)})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Sub-type Selection */}
            {hasSubTypes && (
                <div className="selector-field">
                    <label>Select Type <span style={{ color: 'red' }}>*</span></label>
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
                    <h3>
                        {selectedSport.name}
                        <span className="sport-type-badge">{getSportTypeLabel(selectedSport.type)}</span>
                    </h3>
                    <p>{selectedSport.description}</p>
                    {selectedSport.teamSize > 1 && (
                        <p style={{ marginTop: '8px' }}>👥 Team Size: {selectedSport.teamSize} players</p>
                    )}
                    <p style={{ marginTop: '8px', fontSize: '18px', fontWeight: '600' }}>
                        💰 Registration Fee: ₹{selectedSport.fee}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SportSelector;
