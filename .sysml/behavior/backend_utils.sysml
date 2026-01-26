package BackendUtilities {
    import SysMLPrimitives::*;
    import DataTransferObjects::*;
    import DomainEnums::*;
    
    @SourceFile { :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts"; }
    item def AppError :> BaseDTO {
        attribute statusCode : Integer;
        attribute message : String;
        attribute isOperational : Boolean = true;
    }
    
    @SourceFile { :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts"; }
    action def GlobalErrorHandler {
        in err : AppError;
        out response : HTTPResponse;
    }
    
    @SourceFile { :>> path = "apps/backend/src/utils/jwt.util.ts"; }
    item def JwtPayload :> BaseDTO {
        attribute userId : Identifier;
        attribute email : String;
        attribute role : UserRole;
    }
    
    @SourceFile { :>> path = "apps/backend/src/utils/jwt.util.ts"; }
    action def JwtUtils {
        action sign { in payload : JwtPayload; out token : String; }
        action verify { in token : String; out payload : JwtPayload; }
    }
    
    @SourceFile { :>> path = "apps/backend/src/utils/password.util.ts"; }
    action def PasswordUtils {
        action hash { in password : String; out hash : String; }
        action compare { in password : String; in hash : String; out matches : Boolean; }
    }
}
