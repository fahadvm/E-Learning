import mongoose from "mongoose";
import CompanyCoursePurchase, { ICompanyCoursePurchase }  from "../models/CompanyCoursePurchase";
import { ICompanyCoursePurchaseRepository } from "../core/interfaces/repositories/ICompanyCoursePurchaseRepository";

export class CompanyCoursePurchaseRepository
  implements ICompanyCoursePurchaseRepository
{
  async purchaseCourse(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId,
    seats: number
  ): Promise<ICompanyCoursePurchase> {
    const existing = await CompanyCoursePurchase.findOne({ companyId, courseId });

    if (existing) {
      existing.seatsPurchased += seats;
      return existing.save();
    }

    return CompanyCoursePurchase.create({
      companyId,
      courseId,
      seatsPurchased: seats,
      seatsUsed: 0,
    });
  }

  /*  Increase Seat Usage (Assign Learning Path to Employee) */
  async increaseSeatUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase> {
    const record = await CompanyCoursePurchase.findOne({ companyId, courseId });
    if (!record) throw new Error("Course not purchased");

    if (record.seatsUsed >= record.seatsPurchased) {
      throw new Error("No seats available");
    }

    record.seatsUsed += 1;
    return record.save();
  }

  /* 🔻 Decrease Seat Usage (Unassign employee OR remove employee) */
  async decreaseSeatUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase | null> {
    const record = await CompanyCoursePurchase.findOne({ companyId, courseId });
    if (!record) return null;

    if (record.seatsUsed > 0) record.seatsUsed -= 1;
    return record.save();
  }

  /*   Get Single Course Usage */
  async getCourseUsage(
    companyId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase | null> {
    return CompanyCoursePurchase.findOne({ companyId, courseId });
  }

  /*   Get All Company Purchases */
  async getAllPurchasesByCompany(
    companyId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase[]> {
    return CompanyCoursePurchase.find({ companyId }).populate("courseId");
  }
  async getPaidPurchasesByCompany(
    companyId: mongoose.Types.ObjectId
  ): Promise<ICompanyCoursePurchase[]> {
    return CompanyCoursePurchase.find({ companyId,status: 'paid' }).populate("courseId");
  }
}
