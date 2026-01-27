package APIEndpoints {
    import SysMLPrimitives::*;
    import DataTransferObjects::*;
    import DomainEntities::*;
    @SourceFile {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
    }
    item def LoginEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/login";
        :>> requiresAuth = false;
        item request : LoginRequest;
        item response : AuthResponse;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
    }
    item def ListVehiclesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles";
        item queryParams : PaginationParams;
        item response : PaginatedResponseWrapper;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    item def GetSalesStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/stats";
        item response : SaleStats;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def CreateCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/customers";
        item request : CreateCustomerDto;
        item response : Customer;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def GetCustomerSalesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers/:id/sales";
        :>> pathParams = "id";
        item response : Sale [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def CreateSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/sales";
        item request : CreateSaleDto;
        item response : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetMonthlyStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/monthly-stats";
        item response : MonthlySaleStats [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def GetVehicleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles/:id";
        :>> pathParams = "id";
        item response : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def CreateVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/vehicles";
        item request : CreateVehicleDto;
        item response : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def GetCustomerByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers/:id";
        :>> pathParams = "id";
        item response : Customer;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetSaleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/:id";
        :>> pathParams = "id";
        item response : Sale;
    }
}
