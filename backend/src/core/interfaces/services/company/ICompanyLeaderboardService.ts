export interface ICompanyLeaderboardUserDTO {
  _id: string;
  name: string;
  avatar?: string | null;
  hours: number;
  courses: number;
  streak: number;
  rank: number | null;
}



export interface ICompanyLeaderboardService {
    getTop50(companyId: string): Promise<ICompanyLeaderboardUserDTO[]>;
    searchEmployee(companyId: string, name: string): Promise<ICompanyLeaderboardUserDTO | null>;

}
