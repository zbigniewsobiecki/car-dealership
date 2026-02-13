import { AuthResponse, LoginRequest } from '@car-dealership/shared-types';
export declare const authService: {
    login(credentials: LoginRequest): Promise<AuthResponse>;
    getMe(): Promise<any>;
    logout(): Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map