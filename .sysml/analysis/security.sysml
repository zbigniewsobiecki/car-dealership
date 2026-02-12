package SecurityAnalysis {
        import SysMLPrimitives::*;
    
        doc /*Security posture and controls. */
    
        analysis def SecurityProfile {
            // Authentication
            attribute authenticationMethod : String = "JWT";
            attribute authProvider : String = "Internal (jsonwebtoken)";
            
            // Authorization
            attribute authorizationModel : String = "RBAC";
            attribute permissionGranularity : String = "Role-based (Admin, Salesperson)";
    
            // Input validation
            attribute hasInputValidation : Boolean = true;
            attribute validationLibrary : String = "express-validator / zod";
    
            // Encryption
            attribute hasEncryptionAtRest : Boolean = false; // Not visible in app code
            attribute hasEncryptionInTransit : Boolean = true; // Assumed via TLS/HTTPS in production
            
            // Secrets management
            attribute secretsManagement : String = "Environment Variables (.env)";
    
            // Rate limiting
            attribute hasSecurityRateLimiting : Boolean = true;
            attribute bruteForceProtection : Boolean = true;
    
            // CORS
            attribute hasCORS : Boolean = true;
            @SourceFile { :>> path = "apps/backend/src/app.ts"; }
            attribute corsPolicy : String = "Restricted to configured origin";
    
            // Security Headers
            attribute usesHelmet : Boolean = true;
    
            results {
                attribute securityPosture : String = "Standard web security with JWT and RBAC";
            }
        }
}
