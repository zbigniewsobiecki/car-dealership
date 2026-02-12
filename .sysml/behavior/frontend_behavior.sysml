package FrontendBehavior {
    import DataModel::*;
    import SysMLPrimitives::*;
    import DataTransferObjects::*;
    import DomainEntities::*;
    @SourceFile {
        :>> path = "apps/frontend/src/services/api.ts";
    }
    action def ApiClientConfiguration {
        doc /* Axios instance with interceptors for auth and token refresh */
        action requestInterceptor;
        action responseInterceptor;
        action refreshTokenFlow;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/auth.service.ts";
    }
    action def AuthClientService {
        action login {
            in credentials : LoginRequest;
            out response : AuthResponse;
        }
        action getMe {
            out user : User;
        }
        action logout;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/customers.service.ts";
    }
    action def CustomerClientService {
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
        :>> path = "apps/frontend/src/hooks/useCustomers.ts";
    }
    action def UseCustomersHooks {
        action useCustomers;
        action useCustomer;
        action useCreateCustomer;
        action useUpdateCustomer;
        action useDeleteCustomer;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useSales.ts";
    }
    action def UseSalesHooks {
        action useSales;
        action useSale;
        action useCreateSale;
        action useUpdateSale;
        action useDeleteSale;
        action useSalesStats;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useVehicles.ts";
    }
    action def UseVehiclesHooks {
        action useVehicles;
        action useVehicle;
        action useCreateVehicle;
        action useUpdateVehicle;
        action useDeleteVehicle;
        action useVehicleStats;
    }
}
