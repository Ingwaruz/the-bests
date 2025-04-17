// Типы для клана
export interface Clan {
  tag: string;
  name: string;
  type: string;
  description: string;
  location: Location;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  clanPoints: number;
  clanVersusPoints: number;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  isWarLogPublic: boolean;
  warLeague: WarLeague;
  memberList: ClanMember[];
  labels: Label[];
  requiredVersusTrophies: number;
  requiredTownhallLevel: number;
  clanCapital: ClanCapital;
  chatLanguage: Language;
}

export interface BadgeUrls {
  small: string;
  medium: string;
  large: string;
}

export interface Location {
  id: number;
  name: string;
  isCountry: boolean;
  countryCode: string;
}

export interface WarLeague {
  id: number;
  name: string;
}

export interface Label {
  id: number;
  name: string;
  iconUrls: IconUrls;
}

export interface IconUrls {
  small: string;
  medium: string;
}

export interface Language {
  id: number;
  name: string;
  languageCode: string;
}

export interface ClanCapital {
  capitalHallLevel: number;
  districts: District[];
}

export interface District {
  id: number;
  name: string;
  districtHallLevel: number;
}

// Типы для членов клана
export interface ClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  league: League;
  trophies: number;
  versusTrophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  builderBaseTrophies: number;
  playerHouse: PlayerHouse;
}

export interface League {
  id: number;
  name: string;
  iconUrls: IconUrls;
}

export interface PlayerHouse {
  elements: PlayerHouseElement[];
}

export interface PlayerHouseElement {
  id: number;
  type: string;
}

// Типы для детальной информации об игроке
export interface Player {
  tag: string;
  name: string;
  townHallLevel: number;
  townHallWeaponLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel: number;
  versusTrophies: number;
  bestVersusTrophies: number;
  versusBattleWins: number;
  role: string;
  warPreference: string;
  donations: number;
  donationsReceived: number;
  clanCapitalContributions: number;
  clan: PlayerClan;
  league: League;
  builderBaseLeague: BuilderBaseLeague;
  legendStatistics: LegendStatistics;
  achievements: Achievement[];
  labels: Label[];
  troops: Troop[];
  heroes: Hero[];
  spells: Spell[];
}

export interface PlayerClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
}

export interface BuilderBaseLeague {
  id: number;
  name: string;
}

export interface LegendStatistics {
  legendTrophies: number;
  bestSeason: Season;
  currentSeason: Season;
  previousSeason: Season;
  bestVersusSeason: Season;
  previousVersusSeason: Season;
}

export interface Season {
  id: string;
  rank: number;
  trophies: number;
}

export interface Achievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo: string;
  village: string;
}

export interface Troop {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
  superTroopIsActive?: boolean;
}

export interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Spell {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

// Типы для войн клана
export interface ClanWar {
  state: string;
  teamSize: number;
  preparationStartTime: string;
  startTime: string;
  endTime: string;
  clan: WarClan;
  opponent: WarClan;
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  members: WarMember[];
}

export interface WarMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  attacks?: Attack[];
  opponentAttacks: number;
  bestOpponentAttack?: Attack;
}

export interface Attack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
  duration: number;
}

// Типы для лиги войн кланов
export interface ClanWarLeague {
  state: string;
  season: string;
  clans: ClanWarLeagueClan[];
  rounds: ClanWarLeagueRound[];
}

export interface ClanWarLeagueClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
  members: ClanWarLeagueMember[];
}

export interface ClanWarLeagueMember {
  tag: string;
  name: string;
  townHallLevel: number;
}

export interface ClanWarLeagueRound {
  warTags: string[];
}

// Типы для игр клана
export interface ClanGames {
  startTime: string;
  endTime: string;
  clan: ClanGamesClan;
}

export interface ClanGamesClan {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
  members: ClanGamesMember[];
  score: number;
}

export interface ClanGamesMember {
  tag: string;
  name: string;
  score: number;
} 