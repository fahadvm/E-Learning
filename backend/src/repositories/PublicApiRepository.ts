import { injectable } from "inversify";
import fetch from "node-fetch";

import {
  IGithubContribution,
  ILeetCodeStats,
  IContribution,
  IGithubApiResponse,
  ILeetCodeGraphQLResponse,
} from "../types/common/contribution";

import { IPublicApiRepository } from "../core/interfaces/repositories/IPublicApiRepository";

@injectable()
export class PublicApiRepository implements IPublicApiRepository {
  
  async fetchGitHub(username: string): Promise<IGithubContribution[]> {
    try {
      const url = `https://github-contributions-api.jogruber.de/v4/${username}`;
      const response = await fetch(url);
      const json = (await response.json()) as IGithubApiResponse;

      // Fixed: Proper type checking
      return Array.isArray(json?.contributions) ? json.contributions : [];
    } catch (error) {
      console.error("GitHub fetch failed:", error);
      return [];
    }
  }

  async fetchLeetCodeStats(username: string): Promise<ILeetCodeStats> {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    try {
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username } }),
      });

      const json = (await response.json()) as ILeetCodeGraphQLResponse;

      const stats = json?.data?.matchedUser?.submitStats?.acSubmissionNum;

      if (!Array.isArray(stats)) {
        return { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
      }

      const map: Record<string, number> = { All: 0, Easy: 0, Medium: 0, Hard: 0 };
      stats.forEach((item) => {
        map[item.difficulty] = item.count;
        if (item.difficulty !== "All") map.All += item.count;
      });

      return {
        totalSolved: map.All,
        easySolved: map.Easy,
        mediumSolved: map.Medium,
        hardSolved: map.Hard,
      };
    } catch (error) {
      console.error("LeetCode stats fetch failed:", error);
      return { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    }
  }

  // Fixed signature to match interface
  async fetchAll(leetcodeUsername: string, githubUsername: string): Promise<IContribution> {
    const [github, leetcode] = await Promise.all([
      this.fetchGitHub(githubUsername),
      this.fetchLeetCodeStats(leetcodeUsername),
    ]);

    return { github, leetcode };
  }
}