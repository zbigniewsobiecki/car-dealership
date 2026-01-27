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
    part system : CarDealershipSystem {
        :>> name = "car-dealership-app";
        part :>> frontend : Frontend {
            :>> framework = "react";
            :>> port = 5173;
            // Default Vite port
        }
        part :>> backend : APIServer {
            :>> framework = "express";
            :>> port = 3000;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/.env.example";
    }
    part postgres : PostgreSQL {
        :>> name = "PostgreSQL";
        :>> purpose = "Primary relational database for data persistence";
        :>> port = 5432;
    }
    @SourceFile {
        :>> path = "apps/backend/package.json";
    }
    part def CarDealershipSystem :> WebApplication {
        port httpApi : HTTPPort {
            :>> port = 3000;
        }
    }

    @SourceFile {
        :>> path = "apps/backend/.env.example";
    }
    part redis : Redis {
        :>> host = "localhost";
        :>> port = 6379;
    }
}
