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
        :>> requiresAuth = true;
        item queryParams : PaginationParams;
        item response : PaginatedResponseWrapper;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    item def GetSalesStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/stats";
        :>> requiresAuth = true;
        item response : SaleStats;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def CreateCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/customers";
        :>> requiresAuth = true;
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
        :>> requiresAuth = true;
        item response : Sale [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def CreateSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/sales";
        :>> requiresAuth = true;
        item request : CreateSaleDto;
        item response : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetMonthlyStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/monthly-stats";
        :>> requiresAuth = true;
        item response : MonthlySaleStats [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def GetVehicleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item response : Vehicle;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def CreateVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/vehicles";
        :>> requiresAuth = true;
        item request : CreateVehicleDto;
        item response : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def GetVehicleStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles/stats";
        :>> requiresAuth = true;
        item response : VehicleStats;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def GetCustomerByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item response : Customer;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetSaleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item response : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def RegisterEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/register";
        :>> requiresAuth = true;
        :>> requiredRoles = "ADMIN";
        item request : CreateUserDto;
        item response : User;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def GetMeEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/auth/me";
        :>> requiresAuth = true;
        item response : User;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def RefreshTokenEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/refresh";
        :>> requiresAuth = false;
        item response : AuthResponse;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def UpdateVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/vehicles/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item request : UpdateVehicleDto;
        item response : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def DeleteVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/vehicles/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def UpdateCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/customers/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item request : UpdateCustomerDto;
        item response : Customer;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def DeleteCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/customers/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def ListSalesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales";
        :>> requiresAuth = true;
        item queryParams : PaginationParams;
        item response : PaginatedResponseWrapper;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def UpdateSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/sales/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
        item request : UpdateSaleDto;
        item response : Sale;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def DeleteSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/sales/:id";
        :>> pathParams = "id";
        :>> requiresAuth = true;
    }
}
