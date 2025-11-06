import { Types } from "mongoose";

export interface ILeaderboardUserDTO {
  _id: string;
  name: string;
  hours: number;
  streak: number;
  courses: number;
  isYou: boolean;
}

export interface ILeaderboardResponseDTO {
  leaderboard: ILeaderboardUserDTO[];
  you?: ILeaderboardUserDTO & { rank: number };
}

export interface IEmployeeLeaderboardService {
  getAllTimeLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
  getWeeklyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
  getMonthlyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO>;
}
