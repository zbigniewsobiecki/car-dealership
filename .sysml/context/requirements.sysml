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
        :>> path = "packages/typescript-config/base.json";
    }
    requirement def TR001 :> BaseRequirement {
        doc /* The system shall enforce strict TypeScript type checking across all packages to ensure type safety. */
         :>> id = "TR-001";
    }

    @SourceFile {
        :>> path = "packages/typescript-config/react.json";
    }
    requirement def TR002 :> BaseRequirement {
        doc /* The frontend shall use React with JSX support and DOM-specific type libraries. */
         :>> id = "TR-002";
    }

    @SourceFile {
        :>> path = "packages/typescript-config/node.json";
    }
    requirement def TR003 :> BaseRequirement {
        doc /* Backend modules shall target Node.js environments with ESNext module resolution. */
         :>> id = "TR-003";
    }

    @SourceFile {
        :>> path = "packages/typescript-config/package.json";
    }
    requirement def TR004 :> BaseRequirement {
        doc /* TypeScript configurations shall be managed as a shared internal package to ensure consistency. */
         :>> id = "TR-004";
    }

    @SourceFile {
        :>> path = "package.json";
    }
    requirement def FR001 :> BaseRequirement {
        doc /* The system shall be organized as a monorepo using pnpm workspaces to manage multiple applications and shared packages. */
         :>> id = "FR-001";
    }

    @SourceFile {
        :>> path = "turbo.json";
    }
    requirement def NFR001 :> BaseRequirement {
        doc /* The system shall use Turborepo for build orchestration, supporting parallel task execution and caching of build artifacts. */
         :>> id = "NFR-001";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR002 :> BaseRequirement {
        doc /* The backend shall provide user authentication using bcryptjs for password hashing and jsonwebtoken for session management. */
         :>> id = "FR-002";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR003 :> BaseRequirement {
        doc /* The backend shall implement security measures including rate limiting (express-rate-limit) and security headers (helmet). */
         :>> id = "FR-003";
    }

    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    requirement def FR004 :> BaseRequirement {
        doc /* The system shall support file uploads using multer. */
         :>> id = "FR-004";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR005 :> BaseRequirement {
        doc /* The frontend shall use TanStack Query for server state management and Axios for API communication. */
         :>> id = "FR-005";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR006 :> BaseRequirement {
        doc /* The frontend shall use Zustand for client-side state management. */
         :>> id = "FR-006";
    }

    @SourceFile {
        :>> path = "apps/frontend/package.json";
    }
    requirement def FR007 :> BaseRequirement {
        doc /* The frontend shall implement form handling and validation using react-hook-form and zod. */
         :>> id = "FR-007";
    }
}
