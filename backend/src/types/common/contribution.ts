// src/types/common/contribution.ts
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

export interface IContribution {
  github: IGithubContribution[];
  leetcode: ILeetCodeStats;
}

// GitHub API response
export interface IGithubApiResponse {
  contributions: IGithubContribution[];
  total?: number;
}

// LeetCode GraphQL response
export interface ILeetCodeGraphQLResponse {
  data?: {
    matchedUser?: {
      submitStats?: {
        acSubmissionNum?: Array<{
          difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
          count: number;
        }>;
      };
    };
  };
}