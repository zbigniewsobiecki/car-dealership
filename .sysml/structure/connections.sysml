package SystemConnections {
    import SysMLPrimitives::*;
    import SystemModules::*;
    import SystemInterfaces::*;
    doc /* Module connections and wiring for car-dealership-app */
    connection def AppConnection :> APIConnection {
        end client;
        end server;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/App.tsx";
    }
    connection frontendToBackend : AppConnection {
        connect system.frontend.api to system.backend.api;
    }

    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    connection backendToDb : DatabaseConnection {
        connect system.backend.db to postgres.connection;
    }
}
