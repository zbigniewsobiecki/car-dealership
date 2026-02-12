package SystemInterfaces {
    import DataTransferObjects::*;
    import SysMLPrimitives::*;
    import DomainEntities::*;
    doc /* Module interface definitions with typed ports */
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    port def AuthPort :> ServicePort {
        doc /* Authentication service port for login and registration */
        in item loginRequest : LoginRequest;
        in item refreshRequest;
        in item registerRequest : RegisterRequest;
        out item authResponse : AuthResponse;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    port def CustomerPort :> ServicePort {
        doc /* Customer management service port */
        in item customerData : CreateCustomerDto;
        out item customerRecord : Customer;
        out item salesHistory : Sale [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    port def SalesPort :> ServicePort {
        doc /* Sales management service port */
        in item saleData : CreateSaleDto;
        out item saleRecord : Sale;
        out item stats : JSON;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    port def VehiclePort :> ServicePort {
        doc /* Vehicle inventory service port */
        in item vehicleData : CreateVehicleDto;
        out item vehicleRecord : Vehicle;
        out item inventoryStats : JSON;
    }
}
