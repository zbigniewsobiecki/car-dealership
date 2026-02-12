package APIEndpoints {
    import DataModel::*;
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DomainEnums::*;
    import DataTransferObjects::*;

    @SourceFile {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
    }
    item def LoginEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/login";
        item request : LoginRequest;
        item response : AuthResponse;
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
    }
    item def ListVehiclesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles";
        item queryParams : VehicleFilters;
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    item def GetSalesStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/stats";
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def RefreshTokenEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/refresh";
        :>> requiresAuth = false;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def GetVehicleStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles/stats";
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
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def GetCustomerSalesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers/:id/sales";
        :>> pathParams = ("id");
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def ListCustomersEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers";
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
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def CreateVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/vehicles";
        item request : CreateVehicleDto;
        item response : Vehicle;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def RegisterUserEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::POST;
        :>> path = "/api/auth/register";
        :>> requiresAuth = true;
        :>> requiredRoles = ("ADMIN");
        item request : RegisterRequest;
        item response : AuthResponse;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    item def GetMeEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/auth/me";
        item response : User;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def GetVehicleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/vehicles/:id";
        item response : Vehicle;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def UpdateVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/vehicles/:id";
        item request : UpdateVehicleDto;
        item response : Vehicle;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    item def DeleteVehicleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/vehicles/:id";
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def ListSalesEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales";
        item response : Sale [0..*];
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetMonthlySalesStatsEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/stats/monthly";
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def GetSaleByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/sales/:id";
        item response : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def UpdateSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/sales/:id";
        item request : UpdateSaleDto;
        item response : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    item def DeleteSaleEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/sales/:id";
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def GetCustomerByIdEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::GET;
        :>> path = "/api/customers/:id";
        item response : Customer;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def UpdateCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::PUT;
        :>> path = "/api/customers/:id";
        item request : UpdateCustomerDto;
        item response : Customer;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    item def DeleteCustomerEndpoint :> APIEndpoint {
        :>> method = HTTPMethod::DELETE;
        :>> path = "/api/customers/:id";
    }
}
