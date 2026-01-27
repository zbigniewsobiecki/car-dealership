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
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_AUTH :> BaseRequirement {
        doc /* The system shall support secure user authentication using bcryptjs for password hashing and jsonwebtoken (JWT) for session management. */
         :>> id = "FR-001";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_VALIDATION :> BaseRequirement {
        doc /* The system shall perform input validation using Zod and express-validator to ensure data integrity. */
         :>> id = "FR-002";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_UPLOADS :> BaseRequirement {
        doc /* The system shall support file uploads (e.g., vehicle images) using multer. */
         :>> id = "FR-003";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_STATE_MGMT :> BaseRequirement {
        doc /* The frontend shall manage server state using TanStack Query and client state using Zustand. */
         :>> id = "FR-004";
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/index.ts";
    }
    requirement def FR_DOMAIN_MODELS :> BaseRequirement {
        doc /* The system shall manage domain entities for Users, Vehicles, Customers, and Sales. */
         :>> id = "FR-005";
    }

    @SourceFile {
        :>> path = "package.json";
    }
    requirement def NFR_MONOREPO :> BaseRequirement {
        doc /* The project shall be organized as a monorepo using pnpm workspaces and Turborepo for build orchestration. */
         :>> id = "NFR-001";
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/index.ts";
    }
    requirement def FR_VEHICLE_MGMT :> BaseRequirement {
        doc /* The system shall track vehicle status (e.g., Available, Sold, Reserved) as defined in vehicle-status.enum. */
         :>> id = "FR-006";
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/index.ts";
    }
    requirement def FR_SALE_WORKFLOW :> BaseRequirement {
        doc /* The system shall manage the sale lifecycle including status tracking (e.g., Pending, Completed, Cancelled). */
         :>> id = "FR-007";
    }

    @SourceFile {
        :>> path = "apps/backend/.env.example";
    }
    requirement def SR_CORS :> BaseRequirement {
        doc /* The system shall restrict cross-origin requests to authorized domains defined in the CORS_ORIGIN configuration. */
         :>> id = "SR-001";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_RESPONSIVE_UI :> BaseRequirement {
        doc /* The frontend shall provide a responsive user interface using Tailwind CSS. */
         :>> id = "FR-008";
    }
}
