package SystemInterfaces {
    import SysMLPrimitives::*;
    doc /* Module interface definitions with typed ports for the Car Dealership API. */
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    port def AuthPort :> HTTPPort {
        doc /* POST /login, POST /refresh, POST /register, GET /me */
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    port def CustomerPort :> ServicePort {
        doc /* Port for customer management operations */
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    port def VehiclePort :> ServicePort {
        doc /* Port for vehicle inventory operations */
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    port def SalesPort :> ServicePort {
        doc /* Port for sales transaction operations */
    }
    interface def AuthInterface {
        end provider:AuthPort;
        end consumer:~AuthPort;
    }
    interface def CustomerInterface {
        end provider:CustomerPort;
        end consumer:~CustomerPort;
    }
    interface def VehicleInterface {
        end provider:VehiclePort;
        end consumer:~VehiclePort;
    }
    interface def SalesInterface {
        end provider:SalesPort;
        end consumer:~SalesPort;
    }
}
