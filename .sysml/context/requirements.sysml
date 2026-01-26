package SystemRequirements {
    import SysMLPrimitives::*;
    doc /*System Requirements. Requirements extracted from documentation and codebase analysis for car-dealership-app. Use BaseRequirement from SysMLPrimitives as the base type for all requirements. */

    // Functional requirements (to be populated by analysis)
    // Example: requirement def FR001 :> BaseRequirement { :>> id = "FR-001"; doc /* ... */


    // Functional requirements (to be populated by analysis)
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
    requirement def FR_001 :> BaseRequirement {
        doc /* The system shall provide user authentication using JWT and secure password hashing with bcryptjs. */
         :>> id = "FR-001";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_002 :> BaseRequirement {
        doc /* The system shall support file uploads (e.g., vehicle images) using multer. */
         :>> id = "FR-002";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR_003 :> BaseRequirement {
        doc /* The system shall implement input validation using Zod and express-validator. */
         :>> id = "FR-003";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_004 :> BaseRequirement {
        doc /* The frontend shall manage server state using TanStack Query (React Query). */
         :>> id = "FR-004";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR_005 :> BaseRequirement {
        doc /* The frontend shall implement client-side routing using React Router. */
         :>> id = "FR-005";
    }

    @SourceFile {
        :>> path = "turbo.json";
    }
    requirement def NFR_001 :> BaseRequirement {
        doc /* The build system shall use Turborepo for efficient task orchestration and caching. */
         :>> id = "NFR-001";
    }

    @SourceFile {
        :>> path = "pnpm-workspace.yaml";
    }
    requirement def NFR_002 :> BaseRequirement {
        doc /* The project shall be managed as a monorepo using pnpm workspaces. */
         :>> id = "NFR-002";
    }

    @SourceFile {
        :>> path = "packages/shared-types/package.json";
    }
    requirement def NFR_003 :> BaseRequirement {
        doc /* The system shall maintain shared TypeScript types across frontend and backend packages. */
         :>> id = "NFR-003";
    }

    @SourceFile {
        :>> path = "packages/eslint-config/package.json";
    }
    @SourceFile {
        :>> path = "packages/typescript-config/package.json";
    }
    requirement def NFR_004 :> BaseRequirement {
        doc /* The project shall enforce consistent linting and TypeScript configurations across all packages. */
         :>> id = "NFR-004";
    }
}
