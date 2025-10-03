// repositories/student/StudentRepository.ts
import { injectable } from 'inversify';
import { Admin, IAdmin } from '../models/Admin';
import { IAdminRepository } from '../core/interfaces/repositories/IAdminRepository';
import { BaseRepository } from './BaseRepository';

@injectable()
export class AdminRepository extends BaseRepository <IAdmin> implements IAdminRepository{

    constructor (){
        super(Admin);
    }
}
