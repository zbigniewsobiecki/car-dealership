package AuthOperations {
        import SysMLPrimitives::*;
        import DataTransferObjects::*;
        import DomainEntities::*;
    
        @SourceFile { :>> path = "apps/backend/src/services/auth.service.ts"; }
        action def AuthService {
            action register {
                in data : CreateUserDto;
                out response : AuthResponse;
            }
            action login {
                in email : String;
                in password : String;
                out response : AuthResponse;
            }
            action refreshToken {
                in refreshToken : String;
                out response : AuthResponse;
            }
            action getMe {
                in userId : String;
                out user : User;
            }
        }
    
        @SourceFile { :>> path = "apps/frontend/src/pages/Login.tsx"; }
        part def LoginPage;
}
