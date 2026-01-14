// Sports Data Configuration - All sports categories, events, types, team sizes, and fees

// Sport types - defines if a sport is individual or team-based
export const SPORT_TYPES = {
    INDIVIDUAL: 'individual',
    TEAM: 'team',
    SINGLES: 'singles',
    DOUBLES: 'doubles',
    MIXED_DOUBLES: 'mixed_doubles',
    SQUAD: 'squad',
};

// Main sports data - 6 categories, 16 sports with fees
export const sportsData = [
    // Athletics - Individual Track & Field Events
    {
        id: 'athletics',
        name: 'Athletics',
        icon: '🏃',
        description: 'Track & Field Events',
        sports: [
            {
                id: 'athletics_100m',
                name: '100 Meter Race',
                type: SPORT_TYPES.INDIVIDUAL,
                teamSize: 1,
                fee: 50,
                description: 'Sprint race - Individual participation',
            },
            {
                id: 'athletics_longjump',
                name: 'Long Jump',
                type: SPORT_TYPES.INDIVIDUAL,
                teamSize: 1,
                fee: 50,
                description: 'Long Jump - Individual participation',
            },
        ],
    },

    // Team & Field Sports
    {
        id: 'team_sports',
        name: 'Team & Field Sports',
        icon: '🤼',
        description: 'Team based sports events',
        sports: [
            {
                id: 'tug_of_war',
                name: 'Tug of War',
                type: SPORT_TYPES.TEAM,
                teamSize: 8,
                fee: 500,
                description: '6 Players + 2 Substitutes',
            },
            {
                id: 'kho_kho',
                name: 'Kho-Kho (Girls Only)',
                type: SPORT_TYPES.TEAM,
                teamSize: 12,
                fee: 600,
                description: '12 Players per team - Girls Only',
                genderRestriction: 'female',
            },
            {
                id: 'volleyball',
                name: 'Volleyball',
                type: SPORT_TYPES.TEAM,
                teamSize: 8,
                fee: 500,
                description: '6 Players + 2 Substitutes',
            },
            {
                id: 'football',
                name: 'Football',
                type: SPORT_TYPES.TEAM,
                teamSize: 15,
                fee: 1000,
                description: '11 Players + 4 Substitutes (15 total)',
            },
            {
                id: 'basketball',
                name: 'Basketball',
                type: SPORT_TYPES.TEAM,
                teamSize: 7,
                fee: 500,
                description: '5 Players + 2 Substitutes (7 total)',
            },
        ],
    },

    // Indoor / Board Sports
    {
        id: 'indoor_sports',
        name: 'Indoor / Board Sports',
        icon: '🧠',
        description: 'Chess, Carrom and indoor games',
        sports: [
            {
                id: 'chess',
                name: 'Chess',
                type: SPORT_TYPES.SINGLES,
                teamSize: 1,
                fee: 50,
                description: 'Singles - Individual participation',
            },
            {
                id: 'carrom',
                name: 'Carrom',
                type: SPORT_TYPES.SINGLES,
                teamSize: 1,
                fee: 50,
                description: 'Singles - Individual participation',
                hasSubTypes: true,
                subTypes: [
                    { id: 'carrom_singles', name: 'Singles', type: SPORT_TYPES.SINGLES, teamSize: 1, fee: 50 },
                    { id: 'carrom_doubles', name: 'Doubles', type: SPORT_TYPES.DOUBLES, teamSize: 2, fee: 100 },
                ],
            },
        ],
    },

    // Badminton
    {
        id: 'badminton',
        name: 'Badminton',
        icon: '🏸',
        description: 'Singles, Doubles & Mixed Doubles',
        sports: [
            {
                id: 'badminton_singles',
                name: 'Badminton Singles',
                type: SPORT_TYPES.SINGLES,
                teamSize: 1,
                fee: 100,
                description: 'Singles - Individual participation',
            },
            {
                id: 'badminton_doubles',
                name: 'Badminton Doubles',
                type: SPORT_TYPES.DOUBLES,
                teamSize: 2,
                fee: 150,
                description: 'Doubles - 2 Players',
            },
            {
                id: 'badminton_mixed',
                name: 'Badminton Mixed Doubles',
                type: SPORT_TYPES.MIXED_DOUBLES,
                teamSize: 2,
                fee: 150,
                description: 'Mixed Doubles - 1 Boy + 1 Girl',
            },
        ],
    },

    // Table Tennis
    {
        id: 'table_tennis',
        name: 'Table Tennis',
        icon: '🏓',
        description: 'Singles, Doubles & Mixed Doubles',
        sports: [
            {
                id: 'tt_singles',
                name: 'Table Tennis Singles',
                type: SPORT_TYPES.SINGLES,
                teamSize: 1,
                fee: 100,
                description: 'Singles - Individual participation',
            },
            {
                id: 'tt_doubles',
                name: 'Table Tennis Doubles',
                type: SPORT_TYPES.DOUBLES,
                teamSize: 2,
                fee: 150,
                description: 'Doubles - 2 Players',
            },
            {
                id: 'tt_mixed',
                name: 'Table Tennis Mixed Doubles',
                type: SPORT_TYPES.MIXED_DOUBLES,
                teamSize: 2,
                fee: 150,
                description: 'Mixed Doubles - 1 Boy + 1 Girl',
            },
        ],
    },

    // Esports
    {
        id: 'esports',
        name: 'Esports',
        icon: '🎮',
        description: 'Mobile Gaming - Squad Only',
        sports: [
            {
                id: 'bgmi',
                name: 'BGMI (Battlegrounds Mobile India)',
                type: SPORT_TYPES.SQUAD,
                teamSize: 4,
                fee: 200,
                description: 'Squad Only - 4 Players (No Solo/Duo)',
            },
            {
                id: 'free_fire',
                name: 'Free Fire',
                type: SPORT_TYPES.SQUAD,
                teamSize: 4,
                fee: 200,
                description: 'Squad Only - 4 Players (No Solo/Duo)',
            },
        ],
    },
];

// Helper: Check if sport is team-based (shows Team Name field)
export const isTeamSport = (sportType) => {
    return [
        SPORT_TYPES.TEAM,
        SPORT_TYPES.DOUBLES,
        SPORT_TYPES.MIXED_DOUBLES,
        SPORT_TYPES.SQUAD,
    ].includes(sportType);
};

// Helper: Get display label for sport type
export const getSportTypeLabel = (sportType) => {
    const labels = {
        [SPORT_TYPES.INDIVIDUAL]: 'Individual',
        [SPORT_TYPES.TEAM]: 'Team',
        [SPORT_TYPES.SINGLES]: 'Singles',
        [SPORT_TYPES.DOUBLES]: 'Doubles',
        [SPORT_TYPES.MIXED_DOUBLES]: 'Mixed Doubles',
        [SPORT_TYPES.SQUAD]: 'Squad',
    };
    return labels[sportType] || sportType;
};

// Helper: Find category by ID
export const getCategoryById = (categoryId) => {
    return sportsData.find((cat) => cat.id === categoryId);
};

// Helper: Find sport by ID (searches all categories and sub-types)
export const getSportById = (sportId) => {
    for (const category of sportsData) {
        const sport = category.sports.find((s) => s.id === sportId);
        if (sport) {
            return { ...sport, category: category.name, categoryId: category.id };
        }
        // Check sub-types
        for (const s of category.sports) {
            if (s.subTypes) {
                const subType = s.subTypes.find((st) => st.id === sportId);
                if (subType) {
                    return { ...subType, category: category.name, categoryId: category.id, parentSport: s.name };
                }
            }
        }
    }
    return null;
};

export default sportsData;
