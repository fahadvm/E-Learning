import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import {
  ICompanyAnalyticsRepository,
  ILearningRecord,
  IEmployeeBasic,
  IEmployeeProgress,
  ILearningRecordRaw,
  ICompanyOrder
} from "../../core/interfaces/repositories/ICompanyAnalyticsRepository";

interface TrackerStats {
  totalEmployees: number;
  totalLearningHours: number;
  avgCompletionRate: number;
  totalCourses: number;
  graph: Array<{ label: string; hours: number }>;
  mostActive: Array<{ id: string; name: string; hours: number; progress: number }>;
  leastActive: Array<{ id: string; name: string; hours: number; progress: number }>;
}

@injectable()
export class CompanyAnalyticsService {
  constructor(
    @inject(TYPES.CompanyAnalyticsRepository)
    private readonly repo: ICompanyAnalyticsRepository
  ) {}

  async getTrackerStats(companyId: string, range: "week" | "month" | "year"): Promise<TrackerStats> {
    const now = new Date();
    const startDate = this.getStartDate(now, range);

    const totalEmployees = await this.repo.countEmployees(companyId);

    const learningRecords = await this.repo.getLearningRecords(companyId, startDate);
    const totalMinutes = learningRecords.reduce((sum, r) => sum + (r.minutes ?? 0), 0);
    const totalLearningHours = totalMinutes / 60;

    const progressRecords = await this.repo.getProgressRecords(companyId);
    const avgCompletionRate =
      progressRecords.length > 0
        ? progressRecords.reduce((sum, p) => sum + (p.percentage ?? 0), 0) / progressRecords.length
        : 0;

    const orders = await this.repo.getPaidOrders(companyId);
    const totalCourses = this.countUniqueCourses(orders);

    const graph = await this.getGraphData(companyId, range, startDate, now);

    const employeeStats = await this.getEmployeeStats(companyId, startDate);
    const mostActive = employeeStats.slice(0, 10);
    const leastActive = employeeStats.slice(-10).reverse();

    return {
      totalEmployees,
      totalLearningHours: this.round(totalLearningHours),
      avgCompletionRate: this.round(avgCompletionRate),
      totalCourses,
      graph,
      mostActive,
      leastActive
    };
  }

  private getStartDate(now: Date, range: "week" | "month" | "year"): Date {
    const date = new Date(now);
    if (range === "week") date.setDate(date.getDate() - 7);
    if (range === "month") date.setMonth(date.getMonth() - 1);
    if (range === "year") date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  private countUniqueCourses(orders: ICompanyOrder[]): number {
    const courseSet = new Set<string>();
    orders.forEach(order => {
      order.purchasedCourses.forEach(pc => courseSet.add(pc.courseId));
    });
    return courseSet.size;
  }

  private round(value: number): number {
    return Math.round(value * 10) / 10;
  }

  private async getGraphData(
    companyId: string,
    range: "week" | "month" | "year",
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ label: string; hours: number }>> {
    const records = await this.repo.getLearningRecords(companyId, startDate, endDate);

    if (range === "week") return this.groupByDays(records, startDate);
    if (range === "month") return this.groupByWeeks(records, startDate);
    return this.groupByMonths(records, startDate);
  }

  private groupByDays(
    records: ILearningRecord[],
    startDate: Date
  ): Array<{ label: string; hours: number }> {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: Array<{ label: string; hours: number }> = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);

      const filtered = records.filter(r => new Date(r._id).toDateString() === dayDate.toDateString());
      const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);

      result.push({ label: labels[dayDate.getDay()], hours: this.round(totalMinutes / 60) });
    }

    return result;
  }

  private groupByWeeks(
    records: ILearningRecord[],
    startDate: Date
  ): Array<{ label: string; hours: number }> {
    const result: Array<{ label: string; hours: number }> = [];

    for (let week = 1; week <= 4; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (week - 1) * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const filtered = records.filter(r => {
        const date = new Date(r._id);
        return date >= weekStart && date <= weekEnd;
      });

      const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);

      result.push({ label: `Week ${week}`, hours: this.round(totalMinutes / 60) });
    }

    return result;
  }

  private groupByMonths(
    records: ILearningRecord[],
    startDate: Date
  ): Array<{ label: string; hours: number }> {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result: Array<{ label: string; hours: number }> = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(monthDate.getMonth() + i);

      const filtered = records.filter(r => {
        const date = new Date(r._id);
        return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
      });

      const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);

      result.push({ label: months[monthDate.getMonth()], hours: this.round(totalMinutes / 60) });
    }

    return result;
  }

  private async getEmployeeStats(
    companyId: string,
    startDate: Date
  ): Promise<Array<{ id: string; name: string; hours: number; progress: number }>> {
    const employees = await this.repo.getEmployees(companyId);

    const stats = await Promise.all(
      employees.map(async (emp) => {
        const learningRecords = await this.repo.getEmployeeLearningRecords(emp._id, startDate);
        const totalMinutes = learningRecords.reduce(
          (sum, r) => sum + (r.totalMinutes ?? 0),
          0
        );

        const progressRecords = await this.repo.getEmployeeProgress(emp._id);
        const avgProgress =
          progressRecords.length > 0
            ? progressRecords.reduce((sum, p) => sum + (p.percentage ?? 0), 0) / progressRecords.length
            : 0;

        return {
          id: emp._id,
          name: emp.name ?? emp.email,
          hours: this.round(totalMinutes / 60),
          progress: Math.round(avgProgress)
        };
      })
    );

    return stats.sort((a, b) => b.hours - a.hours);
  }
}
