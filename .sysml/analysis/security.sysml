package SecurityAnalysis {
    import SysMLPrimitives::*;
    
    doc /*Security posture and controls discovered in the middleware and configuration. */
    
    analysis def SecurityProfile {
        // Authentication
        attribute authenticationMethod : String = "jwt";
        attribute authProvider : String = "internal";
    
        // Authorization
        attribute authorizationModel : String = "rbac";
        attribute permissionGranularity : String = "role-based";
    
        // Input validation
        attribute hasInputValidation : Boolean = true;
        attribute validationLibrary : String = "zod + express-validator";
    
        // Encryption
        attribute hasEncryptionAtRest : Boolean = false; // Not explicitly seen in code
        attribute hasEncryptionInTransit : Boolean = true; // Assumed via HTTPS/Helmet
    
        // Secrets management
        attribute secretsManagement : String = "env";
    
        // Rate limiting (security aspect)
        attribute hasSecurityRateLimiting : Boolean = true;
        attribute bruteForceProtection : Boolean = true;
    
        // CORS
        attribute hasCORS : Boolean = true;
        attribute corsPolicy : String = "restricted-origin";
    
        results {
            attribute jwtExpiration : String = "1h";
            attribute refreshExpiration : String = "7d";
            attribute securityHeaders : String = "helmet";
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/middleware/auth.middleware.ts"; }
    package AuthorizationPatterns {
        doc /* Patterns for enforcing access control. */
        
        constraint def RoleRequirement {
            doc /* Ensures the user has one of the required roles. */
            in userRole : String;
            in allowedRoles : String [1..*];
        }
    }
}
