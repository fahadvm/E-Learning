
import { inject, injectable } from 'inversify';
import { ICompanyChatService } from '../../core/interfaces/services/company/ICompanyChatService';
import { TYPES } from '../../core/di/types';
import { IChatRepository } from '../../core/interfaces/repositories/IChatRepository';
import { IChat } from '../../models/chat';

@injectable()
export class CompanyChatService implements ICompanyChatService {
    constructor(
        @inject(TYPES.ChatRepository) private _chatRepo: IChatRepository
    ) { }

    async createCompanyGroup(companyId: string, groupName: string): Promise<IChat> {
        return this._chatRepo.findOrCreateCompanyGroup(companyId, groupName);
    }

    async addEmployeeToGroup(companyId: string, employeeId: string): Promise<void> {
        const group = await this._chatRepo.getCompanyGroupChat(companyId);
        if (group) {
            await this._chatRepo.addParticipantToGroup(group._id as string, employeeId);
        }
    }

    async removeEmployeeFromGroup(companyId: string, employeeId: string): Promise<void> {
        const group = await this._chatRepo.getCompanyGroupChat(companyId);
        if (group) {
            await this._chatRepo.removeParticipantFromGroup(group._id as string, employeeId);
        }
    }

    async getCompanyGroup(companyId: string): Promise<IChat | null> {
        return this._chatRepo.getCompanyGroupChat(companyId);
    }
}
