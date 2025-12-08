export interface IGithubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ILeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface IContributionResponse {
  github: IGithubContribution[];
  leetcode: ILeetCodeStats;
}

export interface IStudentProfile {
  _id: string;
  name: string;
  role?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  about?: string;
  planName?: string;
  planStatus?: "active" | "expired" | "none";
  social_links?: {
    linkedin?: string;
    gitHub?: string;
    leetCode?: string;
  };
}


export type ContributionLevel = IGithubContribution['level']; 

export type GithubColorMap = Record<ContributionLevel, string>;