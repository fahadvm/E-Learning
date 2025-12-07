import mongoose from "mongoose";
import { ICompanyCoursePurchase } from "../../../models/CompanyCoursePurchase";

export interface ICompanyCoursePurchaseRepository {
  purchaseCourse(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId,
    seats: number
  ): Promise<ICompanyCoursePurchase>;

  increaseSeatUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase>;

  decreaseSeatUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase | null>;

  getCourseUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase | null>;

  getAllPurchasesByCompany(
    companyId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase[]>;
}
