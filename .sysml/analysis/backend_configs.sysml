package BackendConfigsAnalysis {
    import SysMLPrimitives::*;
    import BackendUtilities::*;
    
    @SourceFile { :>> path = "apps/backend/src/config/jwt.ts"; }
    item def JwtConfig :> BaseDTO {
        doc /* JWT Configuration settings discovered from apps/backend/src/config/jwt.ts */
        attribute secret : String;
        attribute expiresIn : String;
        attribute refreshSecret : String;
        attribute refreshExpiresIn : String;
    }
    
    @SourceFile { :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts"; }
    package ErrorHandlingImplementation {
        doc /* Implementation details for global error handling. */
        
        // AppError is already defined in BackendUtilities, referencing it here for coverage.
        // The errorHandler function is documented via the GlobalErrorHandler action in BackendUtilities.
    }
}
