package SystemOperations {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DataTransferObjects::*;
    import DomainEnums::*;
    doc /* System operations and behavioral flows. */
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def RegisterUser {
        flow from data.email to checkExisting.email;
        flow from data.password to hashPassword.pass;
        flow from hashPassword.hash to createUser.hash;
        flow from data to createUser.data;
        flow from createUser.user to signTokens.user;
        flow from signTokens.tokens to response;
        first checkExisting then hashPassword;
        first hashPassword then createUser;
        first createUser then signTokens;
        in data : CreateUserDto;
        out response : AuthResponse;

        action checkExisting {
            in email : String;
            out exists : Boolean;
        }
        action hashPassword {
            in pass : String;
            out hash : String;
        }
        action createUser {
            in data : CreateUserDto;
            in hash : String;
            out user : User;
        }
        action signTokens {
            in user : User;
            out tokens : AuthResponse;
        }
    }



    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def LoginUser {
        flow from credentials.email to findUser.email;
        flow from credentials.password to verifyPass.pass;
        flow from findUser.user to signTokens.user;
        flow from signTokens.tokens to response;
        first findUser then verifyPass;
        first verifyPass then signTokens;
        in credentials : LoginRequest;
        out response : AuthResponse;

        action findUser {
            in email : String;
            out user : User;
        }
        action verifyPass {
            in pass : String;
            in hash : String;
            out valid : Boolean;
        }
        action signTokens {
            in user : User;
            out tokens : AuthResponse;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/customers.service.ts";
    }
    action def CreateCustomer {
        flow from data to persist.d;
        flow from creatorId to persist.c;
        flow from persist.res to customer;
        in data : CreateCustomerDto;
        in creatorId : Identifier;
        out customer : Customer;

        action persist {
            in d : CreateCustomerDto;
            in c : Identifier;
            out res : Customer;
        }
    }

    @SourceFile {
        :>> path = "apps/backend/src/services/customers.service.ts";
    }
    action def GetCustomerSales {
        flow from customerId to verifyCustomer.id;
        flow from customerId to fetchSales.id;
        flow from fetchSales.list to sales;
        first verifyCustomer then fetchSales;
        in customerId : Identifier;
        out sales : Sale [0..*];

        action verifyCustomer {
            in id : Identifier;
            out exists : Boolean;
        }
        action fetchSales {
            in id : Identifier;
            out list : Sale [0..*];
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def ProcessSale {
        flow from data.vehicleId to verifyVehicle.id;
        flow from data.customerId to verifyCustomer.id;
        flow from data to createRecord.d;
        flow from createRecord.s to sale;
        flow from data.vehicleId to updateVehicleStatus.id;
        first verifyVehicle then verifyCustomer;
        first verifyCustomer then createRecord;
        first createRecord then updateVehicleStatus;
        in data : CreateSaleDto;
        out sale : Sale;

        action verifyVehicle {
            in id : Identifier;
            out v : Vehicle;
        }
        action verifyCustomer {
            in id : Identifier;
            out c : Customer;
        }
        action createRecord {
            in d : CreateSaleDto;
            out s : Sale;
        }
        action updateVehicleStatus {
            in id : Identifier;
            in status : VehicleStatus;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    action def AddVehicle {
        flow from data.vin to checkVin.vin;
        flow from data to persist.d;
        flow from creatorId to persist.c;
        flow from persist.res to vehicle;
        first checkVin then persist;
        in data : CreateVehicleDto;
        in creatorId : Identifier;
        out vehicle : Vehicle;

        action checkVin {
            in vin : String;
            out exists : Boolean;
        }
        action persist {
            in d : CreateVehicleDto;
            in c : Identifier;
            out res : Vehicle;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
    }
    action def AuthControllerOperations {
        action register {
            flow from req to callService.d;
            flow from callService.r to res;
            in req : CreateUserDto;
            out res : AuthResponse;
            action callService {
                in d : CreateUserDto;
                out r : AuthResponse;
            }
        }
        action login {
            flow from req to callService.d;
            flow from callService.r to res;
            in req : LoginRequest;
            out res : AuthResponse;
            action callService {
                in d : LoginRequest;
                out r : AuthResponse;
            }
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/auth.service.ts";
    }
    action def FrontendAuthOperations {
        action login {
            doc /* POST /auth/login */
            in credentials : LoginRequest;
            out response : AuthResponse;
        }
        action getMe {
            doc /* GET /auth/me */
            out user : User;
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def FrontendVehicleOperations {
        action getAll {
            in filters : VehicleFilters [0..1];
            out vehicles : Vehicle [0..*];
        }
        action getById {
            in id : Identifier;
            out vehicle : Vehicle;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    action def AuthStoreActions {
        action login {
            flow from token to updateLocalStorage.t;
            flow from refreshToken to updateLocalStorage.rt;
            flow from user to updateState.u;
            flow from token to updateState.t;
            first updateLocalStorage then updateState;
            in user : User;
            in token : String;
            in refreshToken : String [0..1];
            action updateLocalStorage {
                in t : String;
                in rt : String [0..1];
            }
            action updateState {
                in u : User;
                in t : String;
            }
        }
        action logout {
            first clearStorage then resetState;
            action clearStorage;
            action resetState;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/jwt.util.ts";
    }
    action def JwtOperations {
        action sign {
            in payload : JSON;
            out token : String;
        }
        action verify {
            in token : String;
            out payload : JSON;
        }
    }

    @SourceFile {
        :>> path = "apps/backend/src/utils/password.util.ts";
    }
    action def PasswordOperations {
        action hash {
            in plain : String;
            out hashed : String;
        }
        action compare {
            in plain : String;
            in hashed : String;
            out valid : Boolean;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useCustomers.ts";
    }
    action def UseCustomersHook {
        action fetchAll {
            out list : Customer [0..*];
        }
        action create {
            first create then invalidateCache;
            in data : CreateCustomerDto;
            action invalidateCache;
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useSales.ts";
    }
    action def UseSalesHook {
        action fetchAll {
            out list : Sale [0..*];
        }
        action create {
            first create then invalidateSales;
            first create then invalidateVehicles;
            in data : CreateSaleDto;
            action invalidateSales;
            action invalidateVehicles;
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useVehicles.ts";
    }
    action def UseVehiclesHook {
        action fetchAll {
            in filters : VehicleFilters;
            out list : Vehicle [0..*];
        }
        action update {
            first update then invalidateCache;
            in id : Identifier;
            in data : UpdateVehicleDto;
            action invalidateCache;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/customers.controller.ts";
    }
    action def CustomersControllerOperations {
        action getAll {
            out res : Customer [0..*];
        }
        action create {
            in req : CreateCustomerDto;
            out res : Customer;
        }
        action getSales {
            in id : Identifier;
            out res : Sale [0..*];
        }
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    action def SalesControllerOperations {
        action create {
            in req : CreateSaleDto;
            out res : Sale;
        }
        action getStats {
            out res : JSON;
        }
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
    }
    action def VehiclesControllerOperations {
        action getAll {
            in query : VehicleFilters;
            out res : Vehicle [0..*];
        }
        action getStats {
            out res : JSON;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/customers.service.ts";
    }
    action def FrontendCustomerOperations {
        action getAll {
            out list : Customer [0..*];
        }
        action create {
            in data : CreateCustomerDto;
            out res : Customer;
        }
        action getSales {
            in id : Identifier;
            out list : Sale [0..*];
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FrontendSaleOperations {
        action getAll {
            out list : Sale [0..*];
        }
        action create {
            in data : CreateSaleDto;
            out res : Sale;
        }
        action getStats {
            out stats : JSON;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/api.ts";
    }
    action def ApiInterceptorOperations {
        action requestInterceptor {
            flow from getToken.t to injectHeader.t;
            flow from req to injectHeader.r;
            flow from injectHeader.ir to interceptedReq;
            first getToken then injectHeader;
            in req : HTTPRequest;
            out interceptedReq : HTTPRequest;
            action getToken {
                out t : String [0..1];
            }
            action injectHeader {
                in r : HTTPRequest;
                in t : String;
                out ir : HTTPRequest;
            }
        }
    }
}
