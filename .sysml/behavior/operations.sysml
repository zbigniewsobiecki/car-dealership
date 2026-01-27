package SystemOperations {
    import DomainEntities::*;
    import SysMLPrimitives::*;
    import DataModel::Entities::*;
    import DataTransferObjects::*;
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def RegisterUser {
        flow from request.email to checkExisting.email;
        flow from request.password to hashPassword.password;
        flow from hashPassword.hash to createUser.hash;
        flow from request to createUser.data;
        flow from createUser.user to generateTokens.user;
        flow from generateTokens.response to response;
        first checkExisting then hashPassword;
        first hashPassword then createUser;
        first createUser then generateTokens;
        in request : CreateUserDto;
        out response : AuthResponse;
        action checkExisting {
            in email : String;
        }
        action hashPassword {
            in password : String;
            out hash : String;
        }
        action createUser {
            in data : CreateUserDto;
            in hash : String;
            out user : User;
        }
        action generateTokens {
            in user : User;
            out response : AuthResponse;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def Login {
        flow from credentials.email to findUser.email;
        flow from credentials.password to verifyPassword.password;
        flow from findUser.user to issueTokens.user;
        flow from issueTokens.response to response;
        first findUser then verifyPassword;
        first verifyPassword then issueTokens;
        in credentials : LoginRequest;
        out response : AuthResponse;
        action findUser {
            in email : String;
            out user : User;
        }
        action verifyPassword {
            in password : String;
            in hash : String;
        }
        action issueTokens {
            in user : User;
            out response : AuthResponse;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def CreateSale {
        flow from data.vehicleId to verifyVehicle.id;
        flow from data.customerId to verifyCustomer.id;
        flow from data to persistSale.data;
        flow from data.vehicleId to updateVehicleStatus.id;
        flow from persistSale.sale to sale;
        first verifyVehicle then verifyCustomer;
        first verifyCustomer then persistSale;
        first persistSale then updateVehicleStatus;
        in data : CreateSaleDto;
        out sale : Sale;
        action verifyVehicle {
            in id : Identifier;
        }
        action verifyCustomer {
            in id : Identifier;
        }
        action persistSale {
            in data : CreateSaleDto;
            out sale : Sale;
        }
        action updateVehicleStatus {
            in id : Identifier;
            in status : DomainEnums::VehicleStatus;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/jwt.util.ts";
    }
    action def SignToken {
        in payload : JSON;
        out token : String;
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/jwt.util.ts";
    }
    action def VerifyToken {
        in token : String;
        out payload : JSON;
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/password.util.ts";
    }
    action def HashPassword {
        in password : String;
        out hash : String;
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/password.util.ts";
    }
    action def ComparePassword {
        in password : String;
        in hash : String;
        out isValid : Boolean;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useVehicles.ts";
    }
    action def UseVehiclesHook {
        flow from filters to fetchVehicles.params;
        flow from fetchVehicles.data.data to vehicles;
        in filters : VehicleFilters [0..1];
        out vehicles : Vehicle [0..*];
        out isLoading : Boolean;
        out error : AnyItem [0..1];
        action fetchVehicles {
            in params : VehicleFilters;
            out data : PaginatedResponseWrapper;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/api.ts";
    }
    action def AxiosRequest {
        in method : String;
        in url : String;
        in data : JSON [0..1];
        out response : ApiResponse;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/auth.service.ts";
    }
    action def FrontendLogin {
        in credentials : LoginRequest;
        out response : AuthResponse;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/customers.service.ts";
    }
    action def FrontendGetCustomers {
        out customers : Customer [0..*];
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FrontendCreateSale {
        in data : CreateSaleDto;
        out sale : Sale;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def FrontendGetVehicles {
        in filters : VehicleFilters [0..1];
        out data : PaginatedResponseWrapper;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useCustomers.ts";
    }
    action def UseCustomersHook {
        out customers : Customer [0..*];
        out isLoading : Boolean;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useSales.ts";
    }
    action def UseSalesHook {
        out sales : Sale [0..*];
        out isLoading : Boolean;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    action def AuthStoreActions {
        action setAuth {
            in user : User;
            in token : String;
        }
        action logout;
        action checkAuth;
    }
}
