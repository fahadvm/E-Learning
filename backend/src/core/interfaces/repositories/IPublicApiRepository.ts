import { IContribution, IGithubContribution, ILeetCodeStats } from '../../../types/common/contribution';

export interface IPublicApiRepository {
    fetchGitHub(username: string): Promise<IGithubContribution[]>;
    fetchLeetCodeStats(username: string): Promise<ILeetCodeStats>;
    fetchAll(leetcodeUsername: string, githubUsername: string): Promise<IContribution>;
}
