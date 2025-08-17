// src/core/dto/admin/adminProfileDto.ts
import { IAdmin } from "../../../models/Admin";

export const adminProfileDto = (admin: IAdmin) => ({
  _id: admin._id.toString(),
  email: admin.email,
  role: admin.role,

});
