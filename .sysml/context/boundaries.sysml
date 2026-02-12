package SystemContext {
    import SysMLPrimitives::*;
    import ProjectMetadata::*;
    doc /*System Context. Defines the system boundary and external dependencies. Discovered from package.json. System context for car-dealership-app */
    // External Systems
    @SourceFile {
        :>> path = "apps/backend/src/config/database.ts";
    }
    part postgres : PostgreSQL {
        :>> name = "PostgreSQL";
        :>> purpose = "Primary relational database for car dealership data.";
        :>> port = 5432;
    }
    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    part fileStorage : S3Storage {
        :>> bucket = "uploads";
        :>> purpose = "Local or cloud storage for uploaded vehicle images and documents.";
    }
    // System Boundary
    part def CarDealershipSystem :> WebApplication {
        @SourceFile {
            :>> path = "apps/frontend/package.json";
        }
        part :>> frontend : Frontend {
            :>> framework = "React";
            :>> port = 5173;
        }

        @SourceFile {
            :>> path = "apps/backend/package.json";
        }
        part :>> backend : APIServer {
            :>> framework = "Express";
            :>> port = 3000;
        }
    }
    part system : CarDealershipSystem;
    @SourceFile {
        :>> path = "package.json";
    }
    part monorepoWorkspace : Module {
        doc /* Root monorepo workspace configuration. */
        :>> path = "package.json";
        attribute packageManager : String = "pnpm@8.15.0";
        attribute nodeEngine : String = ">=18.0.0";
        part appsFolder : Module {
            :>> path = "apps/*";
        }
        part packagesFolder : Module {
            :>> path = "packages/*";
        }
    }

    @SourceFile {
        :>> path = "package.json";
    }
    action def GlobalBuildPipeline {
        doc /* Turbo-powered build and test pipeline defined in root package.json */
        action dev;
        action build;
        action lint;
        action test;
    }
}
