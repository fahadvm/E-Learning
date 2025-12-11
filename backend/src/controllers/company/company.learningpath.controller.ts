// src/controllers/company/company.learningpath.controller.ts
import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { ICompanyLearningPathController } from '../../core/interfaces/controllers/company/ICompanyLearningpathController';
import { ICompanyLearningPathService } from '../../core/interfaces/services/company/ICompanyLearningpathService';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import mongoose from 'mongoose';

@injectable()
export class CompanyLearningPathController implements ICompanyLearningPathController {
    constructor(
        @inject(TYPES.CompanyLearningPathService)
        private readonly _service: ICompanyLearningPathService
    ) { }

    async create(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        console.log(req.body)
        const created = await this._service.create(companyId, req.body);
        sendResponse(res, STATUS_CODES.CREATED, MESSAGES.CREATED_SUCCESS, true, created);
    }

    async getAll(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const list = await this._service.getAll(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.FETCHED_SUCCESS, true, list);
    }

    async getOne(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        const { learningPathId } = req.params;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        if (!learningPathId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const item = await this._service.getOne(learningPathId, companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.FETCHED_SUCCESS, true, item);
    }

    async update(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        const { learningPathId } = req.params;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        if (!learningPathId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const updated = await this._service.update(learningPathId, companyId, req.body);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.UPDATED_SUCCESS, true, updated);
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        const { learningPathId } = req.params;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        if (!learningPathId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        await this._service.delete(learningPathId, companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.DELETED_SUCCESS, true, null);
    }

    async list(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const { page = "1", limit = "10", search = "" } = req.query;
        const data = await this._service.listCompanyLearningPaths(
            companyId,
            Number(page),
            Number(limit),
            String(search || "")
        );
        sendResponse(res, STATUS_CODES.OK, MESSAGES.LEARNING_PATHS_FETCHED, true, data);
    }

    // GET /company/learning-paths/assigned/:employeeId
    async listAssigned(req: AuthRequest, res: Response): Promise<void> {

        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const { employeeId } = req.params;
        if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const items = await this._service.listAssignedLearningPaths(companyId, employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.LEARNING_PATHS_FETCHED, true, items);
    }

    // POST /company/learning-paths/assign
    async assign(req: AuthRequest, res: Response): Promise<void> {
        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const { employeeId, learningPathId } = req.body;
        if (!employeeId || !learningPathId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const progress = await this._service.assignLearningPath(companyId, employeeId, learningPathId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.LEARNING_PATH_ASSIGNED, true, progress);
    }

    // DELETE /company/learning-paths/unassign
    async unassign(req: AuthRequest, res: Response): Promise<void> {
        console.log("controller for delete is working")

        const companyId = req.user?.id;
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const { employeeId, learningPathId } = req.query;
        if (!employeeId || !learningPathId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
        const empId = employeeId as string;
        const lpId = learningPathId as string;

        await this._service.unassignLearningPath(companyId, empId, lpId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.LEARNING_PATH_UNASSIGNED, true, null);
    }

}
