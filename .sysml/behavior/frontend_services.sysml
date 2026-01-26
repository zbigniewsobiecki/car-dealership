package FrontendServices {
    import DataTransferObjects::*;
    import DomainEntities::*;
    @SourceFile {
        :>> path = "apps/frontend/src/services/auth.service.ts";
    }
    action def AuthServiceOperations {
        action login {
            in credentials : LoginRequest;
            out response : AuthResponse;
        }
        action getMe {
            out user : User;
        }
        action logout {
            doc /* Clears local session state. */
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/customers.service.ts";
    }
    action def CustomerServiceOperations {
        action getAll {
            out customers : Customer [0..*];
        }
        action getById {
            in id : String;
            out customer : Customer;
        }
        action create {
            in data : CreateCustomerDto;
            out customer : Customer;
        }
        action update {
            in id : String;
            in data : UpdateCustomerDto;
            out customer : Customer;
        }
        action delete {
            in id : String;
        }
        action getSales {
            in id : String;
            out sales : Sale [0..*];
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def SalesServiceOperations {
        action getAll {
            out sales : Sale [0..*];
        }
        action getById {
            in id : String;
            out sale : Sale;
        }
        action create {
            in data : CreateSaleDto;
            out sale : Sale;
        }
        action update {
            in id : String;
            in data : UpdateSaleDto;
            out sale : Sale;
        }
        action delete {
            in id : String;
        }
        action getStats {
            out stats : JSON;
        }
        action getMonthlyStats {
            out monthlyStats : JSON [0..*];
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def VehicleServiceOperations {
        action getAll {
            in filters : JSON [0..1];
            out vehicles : Vehicle [0..*];
        }
        action getById {
            in id : String;
            out vehicle : Vehicle;
        }
        action create {
            in data : CreateVehicleDto;
            out vehicle : Vehicle;
        }
        action update {
            in id : String;
            in data : UpdateVehicleDto;
            out vehicle : Vehicle;
        }
        action delete {
            in id : String;
        }
        action getStats {
            out stats : JSON;
        }
    }
}
