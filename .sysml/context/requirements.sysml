package SystemRequirements {
    import SysMLPrimitives::*;
    doc /*System Requirements. Requirements extracted from documentation and codebase analysis for car-dealership-app. Use BaseRequirement from SysMLPrimitives as the base type for all requirements. */

    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */


    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */

    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */


    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */

    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */





    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */

    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */








    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */ }
    package FunctionalRequirements {
        doc /*Functional requirements discovered from documentation */
    }

    // Non-functional requirements (to be populated by analysis)
    // Example: requirement def NFR001 :> BaseRequirement { :>> id = "NFR-001"; doc /* ... */ }
    package NonFunctionalRequirements {
        doc /*Non-functional requirements discovered from documentation */
    }


    @SourceFile {
        :>> path = "apps/backend/src/config/database.ts";
    }
    requirement def FR_DB_001 :> BaseRequirement {
        doc /* The system shall persist dealership data in a PostgreSQL database with connection pooling. */
         :>> id = "FR-DB-001";
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/jwt.ts";
    }
    requirement def SR_AUTH_001 :> BaseRequirement {
        doc /* The system shall use JWT (JSON Web Tokens) for secure authentication and session management, including refresh tokens. */
         :>> id = "SR-AUTH-001";
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    requirement def FR_UP_001 :> BaseRequirement {
        doc /* The system shall support file uploads with a configurable maximum file size (default 5MB). */
         :>> id = "FR-UP-001";
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    requirement def SR_CORS_001 :> BaseRequirement {
        doc /* The system shall enforce CORS (Cross-Origin Resource Sharing) policies to restrict API access to authorized origins. */
         :>> id = "SR-CORS-001";
    }


    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_AUTH_001 :> BaseRequirement {
        doc /* The system shall provide user authentication using bcryptjs for password hashing and jsonwebtoken for session tokens. */
         :>> id = "FR-AUTH-001";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_VAL_001 :> BaseRequirement {
        doc /* The system shall perform input validation using express-validator and Zod to ensure data integrity. */
         :>> id = "FR-VAL-001";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_UI_001 :> BaseRequirement {
        doc /* The system shall provide a responsive web interface built with React, utilizing Tailwind CSS for styling and Lucide React for iconography. */
         :>> id = "FR-UI-001";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_STATE_001 :> BaseRequirement {
        doc /* The system shall manage client-side state using Zustand and handle server-state synchronization with TanStack Query. */
         :>> id = "FR-STATE-001";
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    requirement def SR_SEC_001 :> BaseRequirement {
        doc /* The system shall implement security headers using Helmet and rate limiting to protect against common web vulnerabilities. */
         :>> id = "SR-SEC-001";
    }
    @SourceFile {
        :>> path = "package.json";
    }
    requirement def SR_TOOL_001 :> BaseRequirement {
        doc /* The project shall use Turbo for high-performance build orchestration across the monorepo. */
         :>> id = "SR-TOOL-001";
    }

    @SourceFile {
        :>> path = "package.json";
    }
    requirement def SR_ENV_001 :> BaseRequirement {
        doc /* The system shall require Node.js version 18.0.0 or higher for development and runtime. */
         :>> id = "SR-ENV-001";
    }
}
