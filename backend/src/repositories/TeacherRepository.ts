import { injectable } from 'inversify';
import { ITeacherRepository } from '../core/interfaces/repositories/ITeacherRepository';
import { ITeacher, Teacher, VerificationStatus } from '../models/Teacher';
import { FilterQuery } from 'mongoose';


@injectable()
export class TeacherRepository implements ITeacherRepository {

  async create(teacher: Partial<ITeacher>): Promise<ITeacher> {
    return Teacher.create(teacher);
  }

  async updateById(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async findById(teacherId: string): Promise<ITeacher | null> {
    return Teacher.findById(teacherId).lean();
  }

  async findOne(filter: FilterQuery<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findOne(filter).lean();
  }

  async findByEmail(email: string): Promise<ITeacher | null> {
    return Teacher.findOne({ email }).lean();
  }

  async updateByEmail(email: string, updateData: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findOneAndUpdate({ email }, updateData, { new: true }).lean();
  }

  async addProfile(profile: ITeacher): Promise<ITeacher> {
    return Teacher.create(profile);
  }

  async editProfile(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async getProfileByUserId(userId: string): Promise<ITeacher | null> {
    return Teacher.findOne({ userId }).lean();
  }

  async findAll(params?: { skip?: number; limit?: number; search?: string; status?: string; }): Promise<ITeacher[]> {
    const query: FilterQuery<ITeacher> = {};

    if (params?.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }

    // status can be 'active' | 'blocked' | 'unverified' | 'pending' | 'verified' | 'rejected'
    if (params?.status) {
      const s = params.status;
      if (s === 'active') {
        query.isBlocked = false;
      } else if (s === 'blocked') {
        query.isBlocked = true;
      } else if (Object.values(VerificationStatus).includes(s as VerificationStatus)) {
        query.verificationStatus = s;
      }
    }

    return Teacher.find(query)
      .skip(params?.skip || 0)
      .limit(params?.limit || 0)
      .lean();
  }

  async count(search?: string, status?: string): Promise<number> {
    const query: FilterQuery<ITeacher> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'active') query.isBlocked = false;
      else if (status === 'blocked') query.isBlocked = true;
      else if (Object.values(VerificationStatus).includes(status as VerificationStatus)) {
        query.verificationStatus = status;
      }
    }

    return Teacher.countDocuments(query).exec();
  }

  async getUnverifiedTeachers(): Promise<ITeacher[]> {
    return Teacher.find({ isVerified: false, isRejected: false }).lean();
  }

  async findUnverified(): Promise<ITeacher[]> {
    return Teacher.find({ verificationStatus: "pending" }).lean();
  }

  async verifyTeacherById(id: string): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(
      id,
      {
        verificationStatus: VerificationStatus.VERIFIED,
        isVerified: true,
        isRejected: false,
        verificationReason: ''
      },
      { new: true }
    ).lean();
  }
  async rejectTeacherById(id: string, reason: string): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(
      id,
      { verificationStatus: VerificationStatus.REJECTED, isRejected: true, verificationReason: reason },
      { new: true }
    ).lean();
  }
  async updateStatus(teacherId: string, updates: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(teacherId, updates, { new: true }).lean();
  }

  async updateVerificationStatus(id: string, status: VerificationStatus): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, { verificationStatus: status }, { new: true });
  }

  async isProfileComplete(id: string): Promise<boolean> {
    const teacher = await Teacher.findById(id);
    if (!teacher) return false;

    const requiredFields = [
      teacher.about,
      teacher.profilePicture,
      teacher.location,
      teacher.phone,
      teacher.education?.length,
      teacher.experiences?.length,
      teacher.skills?.length,
    ];

    return requiredFields.every((f) => f && f !== '' && f !== 0);
  }

  sendVerificationRequest(id: string, status: VerificationStatus, resumeUrl: string): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, { verificationStatus: status, resumeUrl }, { new: true });
  }



  async findPendingRequests(params?: { skip?: number; limit?: number; search?: string }): Promise<ITeacher[]> {
    const query: FilterQuery<ITeacher> = { verificationStatus: VerificationStatus.PENDING };
    if (params?.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }
    return Teacher.find(query)
      .skip(params?.skip || 0)
      .limit(params?.limit || 0)
      .lean();
  }

  async countPendingRequests(search?: string): Promise<number> {
    const query: FilterQuery<ITeacher> = { verificationStatus: VerificationStatus.PENDING };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    return Teacher.countDocuments(query).exec();
  }

  async findTopTeachers(): Promise<ITeacher[]> {
    return Teacher.find({ isBlocked: false })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(10)
      .select('-password');
  }


}
