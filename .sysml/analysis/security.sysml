package SecurityAnalysis {
    import SysMLPrimitives::*;


    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/middleware/auth.middleware.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    analysis def SecurityProfile {
        // Authentication
        attribute authenticationMethod : String = "jwt";
        attribute authProvider : String = "internal";
        attribute mfaSupported : Boolean = false;

        // Authorization
        attribute authorizationModel : String = "rbac";
        attribute permissionGranularity : String = "role-based";

        // Input validation
        attribute hasInputValidation : Boolean = true;
        attribute validationLibrary : String = "zod (implied by requirements)";
        attribute sanitizesOutput : Boolean = true;
        // helmet

        // Encryption
        attribute hasEncryptionAtRest : Boolean = false;
        attribute hasEncryptionInTransit : Boolean = false;
        // No TLS config seen in app.ts
        attribute encryptionAlgorithms : String [1] = "HS256 (JWT)";

        // Secrets management
        attribute secretsManagement : String = "env";

        // Rate limiting (security aspect)
        attribute hasSecurityRateLimiting : Boolean = true;
        attribute bruteForceProtection : Boolean = true;

        // CORS
        attribute hasCORS : Boolean = true;
        attribute corsPolicy : String = "configurable origin";

        results {
            attribute securityPosture : String;
            attribute identifiedRisks : String [0..*];
            attribute recommendations : String [0..*];
        }
    }

    package ThreatAnalysis {
        doc /*Common threats and mitigations */

        constraint def SQLInjectionMitigation {
            doc /*Use parameterized queries (pg Pool query) */
        }

        constraint def XSSMitigation {
            doc /*Sanitize user input, use CSP (helmet) */
        }

        constraint def CSRFMitigation {
            doc /*Use CSRF tokens (not explicitly seen) */
        }
    }
}
