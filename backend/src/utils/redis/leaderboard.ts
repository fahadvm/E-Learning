import { redis } from '../redisClient';

export const updateCompanyLeaderboard = async (
  companyId: string,
  employeeId: string,
  totalMinutes: number,
  completedCourses: number,
  streakCount: number
) => {
  // Balanced weighted score
  const score = (totalMinutes * 10) + (completedCourses * 50) + (streakCount * 2);

  await redis.zadd(`leaderboard:${companyId}`, score, employeeId);
};

export const removeFromCompanyLeaderboard = async (
  companyId: string,
  employeeId: string
) => {
  await redis.zrem(`leaderboard:${companyId}`, employeeId);
};
