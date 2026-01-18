// Comprehensive Rules and Regulations for All Sports

export const sportRules = {
  // ATHLETICS
  athletics_100m: {
    name: "100 Meter Race",
    category: "Athletics",
    overview: "A sprint race covering 100 meters on a straight track, testing pure speed and explosive power.",
    eligibility: {
      gender: "Separate events for Men and Women",
      participants: "Individual participation only",
    },
    rules: [
      {
        title: "Start",
        points: [
          "Athletes must use starting blocks",
          "False start rule: First false start results in disqualification",
          "Athletes must respond to three commands: 'On your marks', 'Set', and the clap",
        ]
      },
      {
        title: "During Race",
        points: [
          "Athletes must stay in their assigned lanes throughout the race",
          "No physical contact or obstruction of other runners",
          "Athletes must run the entire distance; stopping is grounds for disqualification",
          "Wind assistance readings will be taken; +2.0 m/s is the legal limit",
        ]
      },
      {
        title: "Finish",
        points: [
          "Winner is determined by the first torso to cross the finish line",
          "Athletes must complete the race in their assigned lane",
        ]
      },
      {
        title: "Equipment",
        points: [
          "Athletes may wear running spikes",
        ]
      }
    ],
    penalties: [
      "False start: Immediate disqualification",
      "Lane violation: Disqualification",
      "Obstruction of another runner: Disqualification",
      "Improper conduct: Warning or disqualification",
    ],
    format: "Heats, Semi-finals, and Finals (based on number of participants)",
    support:"Ayush Gupta (7355963738)",
    registrationFee: 100,
  },

  athletics_longjump: {
    name: "Long Jump",
    category: "Athletics",
    overview: "Athletes sprint down a runway and jump as far as possible from a takeoff board into a sand pit.",
    eligibility: {
      gender: "Separate events for Men and Women",
      participants: "Individual participation only",
    },
    rules: [
      {
        title: "Attempts",
        points: [
          "Each athlete gets 3 attempts in the preliminary round",
          "Top 5 athletes advance to finals",
          "Best jump from all attempts counts as final result",
        ]
      },
      {
        title: "Takeoff",
        points: [
          "Athletes must take off from behind the foul line (takeoff board)",
          "Any part of the foot crossing the foul line results in a foul",
          "Takeoff must be from one foot only",
        ]
      },
      {
        title: "Measurement",
        points: [
          "Measurement taken perpendicular to the takeoff line",
          "Manual measurement will be used",
          "Jump is measured to the nearest centimeter",
        ]
      },
      {
        title: "Landing",
        points: [
          "Walking back through the landing area is not permitted",
        ]
      }
    ],
    penalties: [
      "Stepping over the takeoff line: Foul, no distance recorded",
      "Somersaulting: Foul",
      "Walking back through landing area: Foul",
    ],
    format: "Preliminary round (3 attempts) → Finals (Top 5)",
    support:"Ayush Gupta (7355963738)",
    registrationFee: 100,
  },

  cycling: {
    name: "Cycling",
    category: "Athletics",
    overview: "A cycling race where participants compete to complete the designated course in the shortest time.",
    eligibility: {
      gender: "Separate events for Men and Women",
      participants: "Individual participation only",
    },
    rules: [
      {
        title: "Equipment",
        points: [
          "Participants must bring their own bicycle",
          "Helmet is mandatory for all participants",
          "Bicycles must be in good working condition with functional brakes",
          "No motorized or electric bicycles allowed",
          "Participants are advised to wear appropriate cycling attire",
        ]
      },
      {
        title: "Race Start",
        points: [
          "All participants must be at the starting line before the race begins",
          "Race starts on the whistle or starter's signal",
          "False start will result in a restart (maximum one restart per race)",
          "Participants must stay behind the starting line until the signal",
        ]
      },
      {
        title: "During Race",
        points: [
          "Participants must follow the designated route/course",
          "No shortcuts or deviation from the marked path",
          "Overtaking must be done safely without obstructing other cyclists",
          "No physical contact or intentional blocking of other participants",
          "Participants must not receive any external assistance during the race",
          "If a bicycle breaks down, participant may continue on foot or withdraw",
        ]
      },
      {
        title: "Finish",
        points: [
          "Winner is determined by the first cyclist to cross the finish line",
          "Front wheel must fully cross the finish line",
          "Participant must be on the bicycle when crossing the finish line",
        ]
      }
    ],
    penalties: [
      "Not wearing helmet: Disqualification",
      "Taking shortcuts: Disqualification",
      "Intentional obstruction: Warning or disqualification",
      "Receiving external assistance: Disqualification",
      "Unsportsmanlike conduct: Warning or disqualification",
    ],
    format: "Single race or heats based on number of participants",
    support:"Ayush Gupta (7355963738)",
    registrationFee: 100,
  },

  // TEAM SPORTS
  tug_of_war: {
    name: "Tug of War",
    category: "Team Sports",
    overview: "Two teams pull on opposite ends of a rope, with the goal of pulling the rope a certain distance towards their side.",
    eligibility: {
      teamSize: "6 active pullers + 3 substitutes (9 total)",
    },
    rules: [
      {
        title: "Team Composition",
        points: [
          "6 pullers on the rope at any time",
          "3 substitutes allowed (can be changed between rounds)",
          "All team members must be registered before the event",
        ]
      },
      {
        title: "Equipment and Setup",
        points: [
          "Center marker at the middle of the rope",
          "Shoes without metal studs; proper footwear required",
        ]
      },
      {
        title: "Pulling Rules",
        points: [
          "Teams must not sit, kneel, or lock the rope",
          "All pullers must be behind the end of the rope at start",
          "No sudden drops or releases that could cause injury",
          "No wrapping rope around the body",
          "Teams pull on the whistle signal",
        ]
      },
      {
        title: "Winning",
        points: [
          "Pull the marker past the center line to win",
          "Best of 3 rounds (first team to win 2 rounds)",
        ]
      }
    ],
    penalties: [
      "Sitting or kneeling: Warning, then loss of round",
      "Locking the rope: Loss of round",
      "Dangerous behavior: Disqualification",
      "Unsportsmanlike conduct: Warning or disqualification",
    ],
    format: "Single elimination rounds",
    support:"Ayush Gupta (7355963738)",
    registrationFee:500,
  },

  kho_kho: {
    name: "Kho-Kho",
    category: "Team Sports",
    overview: "A traditional Indian tag sport where teams alternate between chasing and defending, requiring speed, strategy, and teamwork.",
    eligibility: {
      teamSize: "12 players per team",
      gender: "Open category",
      participants: "Team registration required",
    },
    rules: [
      {
        title: "Team Structure",
        points: [
          "12 players per team",
          "Teams alternate between chasing and defending",
          "Each inning lasts 7 minutes",
        ]
      },
      {
        title: "Chasing Phase",
        points: [
          "8 chasers sit in the center squares facing alternate directions",
          "1 active chaser pursues defenders",
          "Active chaser can give 'Kho' by tapping a sitting player and saying 'Kho'",
          "Sitting players must face the same direction throughout the turn",
          "Active chaser cannot cross the center lane unless pursuing a defender",
        ]
      },
      {
        title: "Defending Phase",
        points: [
          "3 defenders enter the field and try to avoid being touched",
          "Defenders can run anywhere in the playing area",
          "Once touched, defender must leave the field",
          "New defender enters when one is out",
          "Defenders can take breaks at designated safe zones (poles)",
        ]
      },
    ],
    penalties: [
      "Late Kho (chaser doesn't move immediately): Point to defending team",
      "Wrong direction chase: Point to defending team",
      "Crossing center lane illegally: Point to defending team",
      "Defender leaving the court: Defender out",
    ],
    format: "Knockout rounds",
    support:"Priyanshu Shukla (9305233609)",
    registrationFee: 600,
  },

  volleyball: {
    name: "Volleyball",
    category: "Team Sports",
    overview: "Two teams of 6 players compete to ground the ball on the opponent's court, separated by a net.",
    eligibility: {
      teamSize: "6 players + 3 substitutes (9 total)",
      gender: "Separate Men's and Women's events",
      participants: "Team registration required",
    },
    rules: [
      {
        title: "Match Format",
        points: [
          "Only Sport wears are allowed, Jeans and Track pants are not allowed",
          "Libero must be in different colored jersey than rest of the team",
          "Each set played to 25 points",
          "Rally point system (point on every serve)",
          "Must win by 2 points (no cap at 29-all, next point wins)",
        ]
      },
      {
        title: "Service",
        points: [
          "Server must be within 1-meter behind the back line",
          "Ball must be clearly tossed or released before hitting",
          "Service must cross the net without touching it",
          "Service time limit: 8 seconds after whistle",
        ]
      },
      {
        title: "Playing the Ball",
        points: [
          "Maximum 3 hits per side (block doesn't count)",
          "Same player cannot hit the ball twice consecutively (except on block)",
          "Ball can touch any part of the body",
          "Ball must be hit cleanly, not caught or thrown",
          "Net touch by player during active play is a fault",
          "Ball set by the setter should not be interfered by the opponent before crossing the net",
          "Libero can not serve the ball and can not attack the ball from front row",
    ]
      },

    ],
    penalties: [
      "Net touch: Point to opponent",
      "Foot fault (crossing centerline): Point to opponent",
      "Double hit: Point to opponent",
      "Four touches: Point to opponent",
      "Catch or lift: Point to opponent",
    ],
    format: "Knockout rounds",
    support:"Devansh (9389604174)",
    registrationFee: 900,
  },

  football: {
    name: "Football",
    category: "Team Sports",
    overview: "Two teams of 11 players compete to score goals by getting the ball into the opponent's net, using any body part except hands and arms.",
    eligibility: {
      teamSize: "11 players + 4 substitutes (15 total)",
      gender: "Men's and Women's categories",
      participants: "Team registration required",
    },
    rules: [
      {
        title: "Match Format",
        points: [
          "Two halves of 25 minutes each (may vary based on tournament format)",
          "5-minute half-time break",
          "Extra time will be added at the end of each half for stoppages",
          "In case of a draw: Extra time (2 × 5 minutes) or penalty shootout",
          "Players are required to play in a proper college jersey and playing kit.",
          "Rolling substitutions is not allowed (check tournament-specific rules)",
          "No player should carry anything in his hand or neck (wristwatch, necklace, ring, kada, bracelet, etc.)"
        ]
      },
      {
        title: "Gameplay",
        points: [
          "11 players per team on the field",
          "Shin guards mandatory for all players, otherwise player will not be allowed to play",
          "Goal Keeper can not be substituted during the match or penalty shootout except in case of injury",
          "If penality shootout will be tied after 5 penalties then sudden death will be applied",
          "1 goalkeeper (can use hands inside penalty area)",
          "Offside rule applies (player ahead of ball and last defender)",
          "Throw-ins when ball crosses sideline",
          "Goal kicks and corner kicks as per standard rules",
          "It is recommended that teams bring their own football for practice sessions prior to the match",
        ]
      },
      {
        title: "Fouls and Misconduct",
        points: [
          "Direct free kick: Kicking, tripping, pushing, holding opponent",
          "Indirect free kick: Dangerous play, obstruction",
          "Penalty kick: Direct free kick foul inside penalty area",
          "Yellow card: Caution for unsportsmanlike behavior",
          "Red card: Sending off for serious foul play (player cannot be replaced)",
        ]
      },
      {
        title: "Goalkeeper Rules",
        points: [
          "Can use hands only inside penalty area",
          "Cannot pick up deliberate back pass from teammate",
          "6 seconds to release ball after gaining possession",
        ]
      }
    ],
    penalties: [
      "Handball: Free kick or penalty",
      "Dangerous play: Free kick",
      "Persistent infringement: Yellow card",
      "Serious foul play: Red card",
      "Violent conduct: Red card",
    ],
    format: "knockout rounds",
    support:"Harsh Gupta (8881386255)",
    registrationFee: 1500,
  },

  // basketball: {
  //   name: "Basketball",
  //   category: "Team Sports",
  //   overview: "Two teams of 5 players score points by shooting a ball through the opponent's hoop, combining athleticism, strategy, and teamwork.",
  //   eligibility: {
  //     teamSize: "5 players + 2 substitutes (7 total)",
  //     gender: "Men's and Women's categories",
  //     participants: "Team registration required",
  //   },
  //   rules: [
  //     {
  //       title: "Match Format",
  //       points: [
  //         "4 quarters of 8 minutes each (or 2 halves of 16 minutes)",
  //         "2-minute break between quarters, 5-minute halftime",
  //         "Overtime: 5 minutes if scores are tied",
  //         "Shot clock: 24 seconds per possession",
  //       ]
  //     },
  //     {
  //       title: "Scoring",
  //       points: [
  //         "Field goal inside arc: 2 points",
  //         "Field goal beyond three-point arc: 3 points",
  //         "Free throw: 1 point each",
  //         "Team with most points wins",
  //       ]
  //     },
  //     {
  //       title: "Ball Movement",
  //       points: [
  //         "Dribbling: Bouncing ball with one hand while moving",
  //         "Cannot dribble with two hands or resume dribbling after stopping (double dribble)",
  //         "Traveling: Taking more than 2 steps without dribbling",
  //         "Ball must advance past half-court within 8 seconds",
  //         "3-second violation: Offensive player cannot stay in key for more than 3 seconds",
  //       ]
  //     },
  //     {
  //       title: "Fouls",
  //       points: [
  //         "Personal foul: Illegal physical contact",
  //         "5 personal fouls: Player disqualified from game",
  //         "Team fouls: After 5 team fouls per quarter, bonus free throws awarded",
  //         "Technical foul: Unsportsmanlike conduct (2 free throws + possession)",
  //         "Flagrant foul: Excessive or violent contact (2 free throws + possession)",
  //       ]
  //     }
  //   ],
  //   penalties: [
  //     "Personal foul: Free throws or possession",
  //     "Technical foul: 2 free throws + possession",
  //     "Disqualification: 5 personal fouls or 2 technical fouls",
  //     "Travelling/Double dribble: Turnover",
  //   ],
  //   format: "League round → Knockout (Semifinals & Finals)",
  //   registrationFee: 500,
  // },

  // INDOOR SPORTS
  chess: {
    name: "Chess",
    category: "Indoor Sports",
    overview: "A strategic board game between two players, where the objective is to checkmate the opponent's king.",
    eligibility: {
      age: "Open to all",
      gender: "Open category",
      participants: "Individual participation",
    },
    rules: [
      {
        title: "Time Control",
        points: [
          "Time format: 5 minutes per player",
          "No Time increment",
          "Clock must be pressed after each move",
          "Time runs out: Loss for that player",
        ]
      },
      {
        title: "Gameplay",
        points: [
          "Standard FIDE chess rules apply",
          "Touch-move rule: If you touch a piece, you must move it",
          "Castling, en passant, and promotion rules as per standard chess",
          "Player with white pieces moves first",
          "In case of draw another 3 min game will be played"
        ]
      },
      {
        title: "Winning Conditions",
        points: [
          "Checkmate: Opponent's king is in check with no legal moves",
          "Resignation: Player voluntarily concedes",
          "Time out: Player runs out of time",
          "Draw: Stalemate, insufficient material, threefold repetition, or mutual agreement",
        ]
      },
      {
        title: "Conduct",
        points: [
          "No talking during the game except offering a draw",
          "No use of electronic devices or notes",
          "Players must not disturb opponents",
          "Disputes resolved by arbiter/referee",
        ]
      }
    ],
    penalties: [
      "Illegal move: Warning first, then loss of game on second offense",
      "Touch-move violation: Must make that move if legal",
      "Using external assistance: Disqualification",
      "Unsportsmanlike conduct: Warning or disqualification",
    ],
    format: "Knockout rounds",
    support:"Ayushman Kumar (7007292844)",
    registrationFee: 100,
  },

  carrom_singles: {
    name: "Carrom Singles",
    category: "Indoor Sports",
    overview: "A strike and pocket board game where players aim to pocket all their pieces (coins) before the opponent.",
    eligibility: {
      age: "Open to all",
      gender: "Open category",
      participants: "Individual (1v1)",
    },
    rules: [
      {
        title: "Objective",
        points: [
          "Pocket all your 9 coins (either white or black) before opponent",
          "Pocket the red queen and cover it by pocketing one of your coins",
          "First player to reach 25 points (or other decided score) wins the match",
        ]
      },
      {
        title: "Gameplay",
        points: [
          "Players alternate turns (striker must be within baseline)",
          "Toss decides first break and choice of color",
          "Break: All coins arranged in center, striker hits from baseline",
          "Player continues turn if they pocket their own coin",
          "Turn ends if striker falls, opponent's coin is pocketed, or no coin is pocketed",
        ]
      },
      {
        title: "Queen Rules",
        points: [
          "Queen must be pocketed and covered (by pocketing your own coin immediately after)",
          "If queen is pocketed but not covered, it's returned to center",
          "Queen gives 3 bonus points when covered",
          "Queen can be pocketed anytime during the game",
        ]
      },
      {
        title: "Scoring",
        points: [
          "Pocketing all your coins + queen: 5 points",
          "Pocketing all your coins (no queen): 3 points",
          "Each remaining opponent coin after you finish: +1 point",
          "Match typically played to 25 points or best of 3 boards",
        ]
      }
    ],
    penalties: [
      "Striker falling in pocket: Lose turn + penalty (return your pocketed coin)",
      "Pocketing opponent's coin: Lose turn + bonus to opponent",
      "Violating baseline: Foul, lose turn",
      "Touching any coin before striker settles: Foul",
    ],
    format: "Knockout rounds",
    support:"Ayushman Kumar (7007292844)",
    registrationFee: 100,
  },

  // carrom_doubles: {
  //   name: "Carrom Doubles",
  //   category: "Indoor Sports",
  //   overview: "Team-based carrom where two players form a team and sit opposite each other, coordinating strategy to win.",
  //   eligibility: {
  //     age: "Open to all",
  //     gender: "Open category",
  //     participants: "2 players per team",
  //   },
  //   rules: [
  //     {
  //       title: "Team Setup",
  //       points: [
  //         "Partners sit opposite each other",
  //         "Opponents sit on the remaining two sides",
  //         "Both team members share the same color coins",
  //         "Players alternate turns with opponents (not with partner)",
  //       ]
  //     },
  //     {
  //       title: "Gameplay",
  //       points: [
  //         "Same basic rules as singles carrom",
  //         "Partners work together to pocket all their team's coins",
  //         "Communication between partners is allowed",
  //         "Turn alternates: Player A (Team 1) → Player B (Team 2) → Player C (Team 1) → Player D (Team 2)",
  //       ]
  //     },
  //     {
  //       title: "Scoring & Winning",
  //       points: [
  //         "Team scores points collectively",
  //         "Same scoring system as singles",
  //         "First team to 25 points wins (or best of 3 boards)",
  //         "Both partners share the victory",
  //       ]
  //     },
  //   ],
  //   penalties: [
  //     "Same penalty rules as singles apply",
  //     "Both partners are responsible for their team's conduct",
  //   ],
  //   format: "Knockout rounds",
  //   registrationFee: 100,
  // },

  // BADMINTON
  badminton_singles: {
    name: "Badminton Singles",
    category: "Badminton",
    overview: "One-on-one badminton match where players aim to hit the shuttlecock over the net into the opponent's court.",
    eligibility: {
      age: "Open to all",
      gender: "Men's and Women's categories",
      participants: "Individual",
    },
    rules: [
      {
        title: "Match Format",
        points: [
          "Only final match will be played in best of 3 games (first to win 2 games)",
          "Each game played to 21 points",
          "Must win by 2 points (no cap at 29-all, next point wins)",
          "2-minute break between games",
        ]
      },
      {
        title: "Service Rules",
        points: [
          "Server must hit below waist level",
          "Racket head must point downwards during service",
          "Service made from right court when score is even, left when odd",
          "Service must land diagonally in opponent's service court",
          "Server gets only one attempt per service",
          "Maximum of 10 seconds to serve after the umpire's call",
          "Flickering of Racket during service is not allowed",
        ]
      },
      {
        title: "Scoring",
        points: [
          "Rally point system (point on every rally)",
          "Winner of rally scores a point and serves next",
          "If receiver wins rally, they gain the serve",
          // "Switch ends after each game, and at 11 points in deciding game",
        ]
      },
      {
        title: "Court Play",
        points: [
          "Singles court width: Inner sideline",
          "Full length of court used",
          "Shuttlecock must land within boundaries",
        ]
      }
    ],
    penalties: [
      "Service fault: Point to opponent",
      "Shuttlecock lands out: Point to opponent",
      "Shuttlecock touches player or clothing: Point to opponent",
      "Double hit: Point to opponent",
    ],
    format: "Knockout rounds",
    support:"Harshit Kesharwani ( 8756349695 )",
    registrationFee: 100,
  },

  badminton_doubles: {
    name: "Badminton Doubles",
    category: "Badminton",
    overview: "Team-based badminton where two players work together to outplay the opposing pair.",
    eligibility: {
      age: "Open to all",
      gender: "Men's and Women's categories",
      participants: "2 players per team",
    },
     rules: [
      {
        title: "Match Format",
        points: [
          "Only final match will be played in best of 3 games (first to win 2 games)",
          "Each game played to 21 points",
          "Must win by 2 points (no cap at 29-all, next point wins)",
          "2-minute break between games",
        ]
      },
      {
        title: "Service Rules",
        points: [
          "Server must hit below waist level",
          "Racket head must point downwards during service",
          "Service made from right court when score is even, left when odd",
          "Service must land diagonally in opponent's service court",
          "Server gets only one attempt per service",
          "Maximum of 10 seconds to serve after the umpire's call",
          "Flickering of Racket during service is not allowed",
        ]
      },
      {
        title: "Scoring",
        points: [
          "Rally point system (point on every rally)",
          "Winner of rally scores a point and serves next",
          "If receiver wins rally, they gain the serve",
          // "Switch ends after each game, and at 11 points in deciding game",
        ]
      },
      {
        title: "Court Play",
        points: [
          "Singles court width: Inner sideline",
          "Full length of court used",
          "Shuttlecock must land within boundaries",
        ]
      }
    ],
    penalties: [
      "Service fault: Point to opponent",
      "Shuttlecock lands out: Point to opponent",
      "Shuttlecock touches player or clothing: Point to opponent",
      "Double hit: Point to opponent",
    ],

    format: "Knockout rounds",
    support:"Harshit Kesharwani ( 8756349695 )",
    registrationFee:200,
  },

  badminton_mixed: {
    name: "Badminton Mixed Doubles",
    category: "Badminton",
    overview: "Doubles badminton with one male and one female player per team, combining strategy and mixed-gender coordination.",
    eligibility: {
      age: "Open to all",
      gender: "1 Male + 1 Female per team (mandatory)",
      participants: "2 players per team",
    },
     rules: [
      {
        title: "Match Format",
        points: [
          "Only final match will be played in best of 3 games (first to win 2 games)",
          "Each game played to 21 points",
          "Must win by 2 points (no cap at 29-all, next point wins)",
          "2-minute break between games",
        ]
      },
      {
        title: "Service Rules",
        points: [
          "Server must hit below waist level",
          "Racket head must point downwards during service",
          "Service made from right court when score is even, left when odd",
          "Service must land diagonally in opponent's service court",
          "Server gets only one attempt per service",
          "Maximum of 10 seconds to serve after the umpire's call",
          "Flickering of Racket during service is not allowed",
        ]
      },
      {
        title: "Scoring",
        points: [
          "Rally point system (point on every rally)",
          "Winner of rally scores a point and serves next",
          "If receiver wins rally, they gain the serve",
          // "Switch ends after each game, and at 11 points in deciding game",
        ]
      },
      {
        title: "Court Play",
        points: [
          "Singles court width: Inner sideline",
          "Full length of court used",
          "Shuttlecock must land within boundaries",
        ]
      }
    ],
    penalties: [
      "Service fault: Point to opponent",
      "Shuttlecock lands out: Point to opponent",
      "Shuttlecock touches player or clothing: Point to opponent",
      "Double hit: Point to opponent",
    ],
    format: "Knockout rounds",
    support:"Harshit Kesharwani ( 8756349695 )",
    registrationFee: 200,
  },

  tt_doubles: {
    name: "Table Tennis Doubles",
    category: "Table Tennis",
    overview: "Team-based table tennis where partners alternate hitting the ball in a fast-paced coordinated effort.",
    eligibility: {
      age: "Open to all",
      gender: "Men's and Women's categories",
      participants: "2 players per team",
    },
    rules: [
      {
        title: "Match Format",
        points: [
          "Best of 5 games to 11 points each",
          "Same scoring system as singles",
          "Partners must alternate hitting the ball",
        ]
      },
      {
        title: "Alternating Hits",
        points: [
          "After service, partners must alternate hitting the ball",
          "A-B-A-B sequence must be maintained",
          "Failing to alternate results in point to opponent",
          "Both players must be ready and in position",
        ]
      },
      {
        title: "Service Rules",
        points: [
          "Service alternates between teams every 2 points",
          "Service also alternates between partners",
          "Ball must bounce on server's right half-court, then opponent's right half-court",
        ]
      },
    ],
    penalties: [
      "Out-of-turn hit: Point to opponent",
      "Service fault: Point to opponent",
      "Same general fault rules as singles",
    ],
    format: "Knockout rounds",
    support:"Mohammad Arshad ( 8395850798 )",
    registrationFee: 200,
  },

  tt_mixed: {
    name: "Table Tennis Mixed Doubles",
    category: "Table Tennis",
    overview: "Doubles table tennis with one male and one female player per team.",
    eligibility: {
      age: "Open to all",
      gender: "1 Male + 1 Female per team (mandatory)",
      participants: "2 players per team",
    },
    rules: [
      {
        title: "Team Composition",
        points: [
          "Must have 1 male and 1 female player",
          "Both players must alternate hits",
          "No substitution once match starts",
        ]
      },
      {
        title: "Gameplay",
        points: [
          "Same rules as regular doubles",
          "Best of 5 games to 11 points",
          "Partners must alternate hitting",
        ]
      },
    ],
    penalties: [
      "Gender requirement violation: Disqualification",
      "Same fault rules as regular doubles",
    ],
    format: "Knockout rounds",
    support:"Mohammad Arshad ( 8395850798 )",
    registrationFee: 200,
  },

  // ESPORTS
  bgmi: {
    name: "BGMI (Battlegrounds Mobile India)",
    category: "Esports",
    overview: "Battle royale mobile game where squads compete to be the last team standing on a shrinking battleground.",
    eligibility: {
      age: "Must be 18+ (as per BGMI terms)",
      gender: "Open category",
      participants: "Squad of 4 players (no solo/duo allowed)",
    },
    rules: [
      {
        title: "Team Format",
        points: [
          "Squad mode only (4 players per team)",
          "All players must use mobile devices (tablets not allowed)",
          "TPP (Third Person Perspective) mode",
          "No emulators allowed",
        ]
      },
      {
        title: "Tournament Structure",
        points: [
          "Points awarded based on placement and kills",
          "Placement points: 1st place (10 pts), 2nd (6 pts), 3rd (5 pts), etc.",
          "Kill points: 1 point per kill",
          "Team with highest total points wins",
        ]
      },
      {
        title: "Match Rules",
        points: [
          "All standard BGMI rules apply",
          "No teaming with other squads",
          "Custom room code will be provided",
          "Players must join lobby 10 minutes before match",
        ]
      },
      {
        title: "Equipment",
        points: [
          "Players must bring their own mobile devices",
          "Stable internet connection will be provided",
          "Headphones/earphones recommended",
          "Devices must have latest BGMI version installed",
        ]
      }
    ],
    penalties: [
      "Teaming: Disqualification",
      "Using hacks/cheats: Permanent ban + disqualification",
      "Toxic behavior: Warning or disqualification",
      "Late arrival: Match starts without team",
    ],
    format: "Knockout rounds",
    support:"Rajat Satsangi ( 7456076594 )",
    registrationFee: 400,
  },

  free_fire: {
    name: "Free Fire",
    category: "Esports",
    overview: "Fast-paced battle royale mobile game where squads fight for survival on a remote island.",
    eligibility: {
      age: "Open to all",
      gender: "Open category",
      participants: "Squad of 4 players",
    },
    rules: [
      {
        title: "Team Format",
        points: [
          "Squad mode only (4 players per team)",
          "All players must use mobile devices",
          "No emulators or external controllers allowed",
          "TPP (Third Person Perspective) mode",
        ]
      },
      {
        title: "Tournament Structure",
        points: [
          "Points system: Placement + Kills",
          "Booyah (1st place): 12 points,(2nd place): 8pts, (3rd place): 6pts, etc.",
          "Each kill: 1 point",
        ]
      },
      {
        title: "Match Rules",
        points: [
          "Standard Free Fire rules apply",
          "No collaboration with enemy squads",
          "Custom room will be created for tournament",
          "Room ID and password shared before match",
          "All players must join 10 minutes before start",
        ]
      },
    ],
    penalties: [
      "Hacking/cheating: Permanent ban + disqualification",
      "Teaming with opponents: Disqualification",
      "Abusive behavior: Warning or disqualification",
      "Not joining on time: Forfeit match",
    ],
    format: "Knockout rounds",
    support:"Mohammad Anas ( 7275784756 )",
    registrationFee: 400,
  },

  // CRICKET
  cricket: {
    name: "Cricket",
    category: "Team Sports",
    overview: "A bat-and-ball game played between two teams of eleven players on a field with a 22-yard pitch. Teams alternate batting and bowling to score runs and take wickets.",
    eligibility: {
      teamSize: "11 players + 4 substitutes (15 total)",
      gender: "Men's and Women's categories",
      participants: "Team registration required",
    },
    rules: [
      {
        title: "Match Format",
        points: [
          "Tournament format: Matches will be played in the format specified by the organizing committee (8 over on knock out basis & final will be of 10 overs)",
          "Only registered players are allowed to play. No last-minute substitutions unless approved by the organizing committee.",
          "Matches will be played with hard Red Ball",
          "Each over consists of 6 legal deliveries",
          // "Team batting first sets a target; team batting second chases",
          // "Powerplay overs: First 6 overs with fielding restrictions",
          // "Maximum 2 fielders outside 30-yard circle during powerplay",
          // "After powerplay, maximum 5 fielders outside the circle",
        ]
      },
      {
        title: "Batting Rules",
        points: [
          "Two batsmen on the field at all times",
          // // "Batsman is out if bowled, caught, LBW, stumped, run out, hit wicket, or handled ball",
          // "Runs scored by running between wickets or hitting boundaries (4 runs for ground boundary, 6 for over boundary)",
          "Wide and no-ball result in 1 extra run plus a free hit (for no-ball)",
          // "Batsman must keep some part of body/bat behind crease to avoid being run out",
          "Obstructing the field or handling the ball illegally results in dismissal",
        ]
      },
      {
        title: "Bowling Rules",
        points: [
          "Bowler must deliver with a straight arm (no throwing/chucking/jerk)",
          "Front foot must land behind the popping crease (no-ball if exceeded)",
          // "Wide ball: Ball too wide for batsman to play a normal shot",
          // "No-ball: Front foot overstep, bouncer above shoulder, or full toss above waist",
          "Maximum 1 bouncer per over in limited-overs format",
          "Each bowler can bowl maximum 2 overs or as per format",
        ]
      },
      {
        title: "Fielding Rules",
        points: [
          // "11 fielders including wicketkeeper and bowler",
          "Wicketkeeper must remain behind stumps until ball is bowled",
          "Fielders cannot obstruct batsmen while running",
          "Fair catch: Ball must be caught cleanly without touching boundary or ground",
          "Substitute fielders allowed but cannot bat, bowl, or keep wicket",
          // "Fielding positions must comply with powerplay restrictions",
        ]
      },
      {
        title: "Dismissals (Ways to Get Out)",
        points: [
          "Bowled: Ball hits and dislodges the stumps/bails",
          "Caught: Fielder catches ball before it touches ground",
          "LBW is not applicable.",
          "Stumped: Wicketkeeper dislodges bails while batsman is out of crease",
          "Run Out: Fielder breaks wicket while batsman is outside crease",
          "Hit Wicket: Batsman accidentally hits own stumps",
          "Handled Ball / Obstructing Field: Deliberate interference",
        ]
      },
      {
        title: "Winning Conditions",
        points: [
          // "Team with most runs wins",
          "If scores are tied: Super Over (1 over per side) decides winner",
          // "Super Over tie: Count of boundaries, then wickets, then coin toss",
          // "Team bowling second wins by wickets remaining",
          // "Team batting second wins by runs scored above target",
        ]
      }
    ],
    penalties: [
      "No-ball: 1 run + free hit to batting team",
      "Wide ball: 1 run + ball rebowled",
      // "Slow over rate: Penalty runs or fielding restrictions",
      "Ball tampering: Disqualification and potential ban",
      // "Appealing excessively: Warning from umpire",
      "Overthrow Run will be allowed",
      "Dissent with umpire decision: Warning or penalty runs",
      "Deliberate short run: Run not counted + warning",
      "Fake fielding: 5 penalty runs to batting team",
    ],
    format: "Knockout rounds",
    support:"Himanshu Singh ( 8127155421 )",
    registrationFee:1500,
  },
};

// Helper function to get rules by sport ID
export const getRulesBySportId = (sportId) => {
  return sportRules[sportId] || null;
};

export default sportRules;
