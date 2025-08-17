// src/services/admin/SubscriptionPlanService.ts
import { inject, injectable } from 'inversify';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../core/DI/types';

@injectable()
export class StudentSubscriptionService implements IStudentSubscriptionService {
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)
        private _planRepo: ISubscriptionPlanRepository
    ) {}

    getAllForStudent() {
        return this._planRepo.findAllForStudents();
    }
}