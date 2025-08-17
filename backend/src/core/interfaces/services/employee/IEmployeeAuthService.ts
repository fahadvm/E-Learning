
export interface IEmployeeAuthService{
    login(email:string , password:string):Promise<{
        token:string,
        refreshToken :string;
        user:{
            id : string ;
            role: string;
            email: string;
            name :string
        }
    }>
    
}