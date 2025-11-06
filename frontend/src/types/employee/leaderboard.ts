export interface LeaderboardUser {
  _id: string;
  rank: number;
  name: string;
  hours: number;
  streak: number;
  courses: number;
  avatar?: string;
  isYou?: boolean;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  you?: LeaderboardUser;
}
