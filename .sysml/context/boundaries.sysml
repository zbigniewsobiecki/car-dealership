package SystemContext {
    import SysMLPrimitives::*;
    import ProjectMetadata::*;
    doc /*System Context. Defines the system boundary and external dependencies. Discovered from package.json. System context for car-dealership-app */
    @external;
    part def ExternalDependency {
        attribute name : String;
        attribute purpose : String;
        attribute dependencyType : String;
        attribute version : String [0..1];
    }

    part postgresql : ExternalDependency {
        :>> name = "PostgreSQL";
        :>> purpose = "Data persistence";
        :>> dependencyType = "database";
        :>> version = "^8.11.0";
    }

    part http_client : ExternalDependency {
        :>> name = "HTTP Client";
        :>> purpose = "External API communication";
        :>> dependencyType = "api";
    }

    // System boundary
    part def System {
        doc /*The car-dealership-app system */

        // Application entry points
        attribute appEntryPoint_apps_backend_src_server_ts : FilePath = "apps/backend/src/server.ts";
        attribute appEntryPoint_apps_frontend_src_main_tsx : FilePath = "apps/frontend/src/main.tsx";

        // Library entry points (for reference)
        attribute libEntryPoint_packages_shared_types_src_index_ts : FilePath = "packages/shared-types/src/index.ts";

        // System ports (discovered interfaces)
        port httpApi;
    }
    part system : CarDealershipSystem;

    part database : PostgreSQL {
        :>> name = "PostgreSQL";
        :>> purpose = "Primary data persistence for vehicle, sales, and user data.";
    }

    part def CarDealershipSystem :> WebApplication {
        port httpApi : HTTPPort;
        part :>> frontend : Frontend {
            :>> framework = "react";
        }
        part :>> backend : APIServer {
            :>> framework = "express";
        }
    }

    @SourceFile {
        :>> path = "apps/backend/.env.example";
    }
    part postgres_db : PostgreSQL {
        :>> name = "car_dealership";
        :>> host = "localhost";
        :>> port = 5432;
        :>> purpose = "Relational database for car dealership data.";
    }

    @SourceFile {
        :>> path = "apps/frontend/.env.example";
    }
    part backend_api : APIServer {
        :>> name = "Backend API";
        :>> port = 3000;
        :>> basePath = "/api";
    }

    @SourceFile {
        :>> path = "packages/eslint-config/package.json";
    }
    part linter : Module {
        :>> name = "ESLint Config";
        :>> path = "packages/eslint-config";
        :>> layer = "Tooling";
    }

    @SourceFile {
        :>> path = "packages/shared-types/package.json";
    }
    part shared_types : Module {
        :>> name = "Shared Types";
        :>> path = "packages/shared-types";
        :>> layer = "Domain";
    }
}
