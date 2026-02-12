package SystemOperations {
    import DataModel::*;
    import SystemOperations::AuthenticateRequest;
    import DataTransferObjects::*;
    import DomainEnums::*;
    import DomainEntities::*;
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def RegisterUser {
        first checkExisting then hashPassword;
        first hashPassword then saveUser;
        first saveUser then createTokens;
        in request : RegisterRequest;
        out response : AuthResponse;
        action checkExisting {
            in email : String;
        }
        action hashPassword {
            in raw : String;
            out hashed : String;
        }
        action saveUser {
            in data : UserWithPassword;
            out user : User;
        }
        action createTokens {
            in user : User;
            out tokens : AuthResponse;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def LoginUser {
        first findUser then verifyActive;
        first verifyActive then verifyPassword;
        first verifyPassword then createTokens;
        in credentials : LoginRequest;
        out response : AuthResponse;
        action findUser {
            in email : String;
            out user : UserWithPassword;
        }
        action verifyActive {
            in user : User;
        }
        action verifyPassword {
            in raw : String;
            in hashed : String;
        }
        action createTokens {
            in user : User;
            out tokens : AuthResponse;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def CreateSale {
        flow from data.vehicleId to verifyVehicle.id;
        flow from data.customerId to verifyCustomer.id;
        flow from data to persistSale.data;
        flow from persistSale.sale to sale;
        first verifyVehicle then verifyCustomer;
        first verifyCustomer then persistSale;
        first persistSale then updateVehicleStatus;
        in data : CreateSaleDto;
        out sale : Sale;
        action verifyVehicle {
            in id : Identifier;
            out vehicle : Vehicle;
        }
        action verifyCustomer {
            in id : Identifier;
            out customer : Customer;
        }
        action persistSale {
            in data : CreateSaleDto;
            out sale : Sale;
        }
        action updateVehicleStatus {
            in id : Identifier;
            in status : VehicleStatus;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    action def CreateVehicle {
        flow from data.vin to checkVin.vin;
        flow from data to saveVehicle.data;
        flow from creatorId to saveVehicle.creator;
        flow from saveVehicle.vehicle to vehicle;
        first checkVin then saveVehicle;
        in data : CreateVehicleDto;
        in creatorId : Identifier;
        out vehicle : Vehicle;
        action checkVin {
            in vin : String;
        }
        action saveVehicle {
            in data : CreateVehicleDto;
            in creator : Identifier;
            out vehicle : Vehicle;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def GetSalesStats {
        out stats : JSON;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def GetMonthlySalesStats {
        out stats : JSON;
    }
    @SourceFile {
        :>> path = "apps/backend/src/middleware/auth.middleware.ts";
    }
    action def AuthenticateRequest {
        first extractToken then verifyJwt;
        in token : String;
        out user : JSON;
        action extractToken {
            in header : String;
            out token : String;
        }
        action verifyJwt {
            in token : String;
            out decoded : JSON;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts";
    }
    action def HandleError {
        in error : BaseEntity;
        out response : HTTPResponse;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    action def UpdateAuthState {
        in user : User [0..1];
        in token : String [0..1];
        in isAuthenticated : Boolean;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    action def ClearAuthState {
        doc /* Resets auth store and clears local storage */
    }
    @SourceFile {
        :>> path = "apps/backend/src/utils/jwt.util.ts";
    }
    action def SignToken {
        in payload : JSON;
        out token : String;
    }

    @SourceFile {
        :>> path = "apps/backend/src/utils/password.util.ts";
    }
    action def HashPassword {
        in password : String;
        out hash : String;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/customers.controller.ts";
    }
    action def CustomerControllerActions {
        action getAll;
        action getById;
        action create;
        action update;
        action delete;
        action getSales;
    }

    @SourceFile {
        :>> path = "apps/backend/src/services/customers.service.ts";
    }
    action def CustomerServiceOperations {
        action getAllCustomers {
            out customers : PaginatedResponse;
        }
        action getCustomerById {
            in id : Identifier;
            out customer : Customer;
        }
        action createCustomer {
            in data : CreateCustomerDto;
            in createdBy : Identifier;
            out customer : Customer;
        }
        action updateCustomer {
            in id : Identifier;
            in data : UpdateCustomerDto;
            out customer : Customer;
        }
        action deleteCustomer {
            in id : Identifier;
        }
        action getCustomerSales {
            in id : Identifier;
            out sales : Sale [0..*];
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FetchAllSales {
        doc /* Retrieves all sales records via the API */
        out sales : Sale [0..*];
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FetchSaleById {
        doc /* Retrieves a specific sale record by ID */
        in id : String;
        out sale : Sale;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def CreateSaleClient {
        doc /* Client-side action to create a new sale */
        in data : CreateSaleDto;
        out sale : Sale;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def UpdateSaleClient {
        doc /* Client-side action to update an existing sale */
        in id : String;
        in data : UpdateSaleDto;
        out sale : Sale;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def DeleteSaleClient {
        doc /* Client-side action to delete a sale record */
        in id : String;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FetchSalesStats {
        doc /* Retrieves general sales statistics */
        out stats : JSON;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    action def FetchMonthlySalesStats {
        doc /* Retrieves monthly aggregated sales statistics */
        out stats : JSON;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def FetchAllVehicles {
        doc /* Retrieves filtered vehicle inventory from the API */
        in filters : VehicleFilters [0..1];
        out vehicles : Vehicle [0..*];
        action ConstructQueryParams {
            doc /* Maps VehicleFilters attributes to URL search parameters */
            in filters : VehicleFilters;
            out params : String;
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def FetchVehicleById {
        doc /* Retrieves a specific vehicle by ID */
        in id : String;
        out vehicle : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def CreateVehicleClient {
        doc /* Client-side action to add a new vehicle to inventory */
        in data : CreateVehicleDto;
        out vehicle : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def UpdateVehicleClient {
        doc /* Client-side action to update vehicle details */
        in id : String;
        in data : UpdateVehicleDto;
        out vehicle : Vehicle;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def DeleteVehicleClient {
        doc /* Client-side action to remove a vehicle from inventory */
        in id : String;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    action def FetchVehicleStats {
        doc /* Retrieves inventory statistics (e.g., counts by status) */
        out stats : JSON;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    action def UpdateVehicle {
        in id : Identifier;
        in data : UpdateVehicleDto;
        out vehicle : Vehicle;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    action def DeleteVehicle {
        in id : Identifier;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def UpdateSale {
        in id : Identifier;
        in data : UpdateSaleDto;
        out sale : Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def DeleteSale {
        in id : Identifier;
    }
}
