
export interface ILeaderboardUserDTO {
  _id: string;
  name: string;
  hours: number;
  streak: number;
  courses: number;
  isYou: boolean;
  rank: number;
}

export interface ILeaderboardResponseDTO {
  leaderboard: ILeaderboardUserDTO[];
  you?: ILeaderboardUserDTO;
}

export interface IEmployeeLeaderboardService {
  getAllTimeLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
  getWeeklyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
  getMonthlyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
}
