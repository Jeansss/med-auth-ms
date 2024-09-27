export interface IAuthUseCase {
    login(user: any): Promise<string>;
    validateUser(email: string, password: string): Promise<any>;
}