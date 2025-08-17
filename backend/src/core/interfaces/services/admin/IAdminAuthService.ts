
export interface IAdminAuthService {
  login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    admin: {
      id: string;
      email: string;
      role: string;
    };
  }>;


}
