package DataTransferObjects {
    import SysMLPrimitives::*;
    import DomainEnums::*;

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def CreateUserDto :> BaseDTO {
        attribute email : String;
        attribute password : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : UserRole;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/customer.types.ts";
    }
    item def CreateCustomerDto :> BaseDTO {
        attribute firstName : String;
        attribute lastName : String;
        attribute email : String [0..1];
        attribute phone : String [0..1];
        attribute address : String [0..1];
        attribute city : String [0..1];
        attribute stateProvince : String [0..1];
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        attribute state : String [0..1];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def CreateVehicleDto :> BaseDTO {
        attribute vin : String;
        attribute make : String;
        attribute model : String;
        attribute year : Integer;
        attribute color : String;
        attribute mileage : Integer [0..1];
        attribute price : Real;
        attribute cost : Real [0..1];
        attribute status : VehicleStatus;
        attribute condition : VehicleCondition [0..1];
        attribute features : JSON [0..1];
        attribute dateAcquired : DateTime [0..1];
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/sale.types.ts";
    }
    item def CreateSaleDto :> BaseDTO {
        attribute vehicleId : Identifier;
        attribute customerId : Identifier;
        attribute salespersonId : Identifier;
        attribute salePrice : Real;
        attribute saleDate : DateTime;
        attribute status : SaleStatus;
        attribute paymentMethod : String [0..1];
        attribute financingDetails : JSON [0..1];
        attribute tradeInVehicle : String [0..1];
        attribute tradeInValue : Real [0..1];
        attribute downPayment : Real [0..1];
        attribute notes : String [0..1];
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/api/requests.types.ts";
    }
    item def LoginRequest :> BaseDTO {
        attribute email : String;
        attribute password : String;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/requests.types.ts";
    }
    item def RegisterRequest :> BaseDTO {
        attribute email : String;
        attribute password : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : String;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/requests.types.ts";
    }
    item def PaginationParams :> BaseDTO {
        attribute page : Integer [0..1];
        attribute limit : Integer [0..1];
        attribute sortBy : String [0..1];
        attribute sortOrder : String [0..1];
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def AuthResponse :> BaseDTO {
        item user : DomainEntities::User;
        attribute token : String;
        attribute refreshToken : String [0..1];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def ApiError :> BaseDTO {
        attribute message : String;
        attribute code : String [0..1];
        attribute field : String [0..1];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def ApiResponse :> BaseDTO {
        attribute success : Boolean;
        item data : AnyItem [0..1];
        item error : ApiError [0..1];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def PaginatedResponseWrapper :> BaseDTO {
        item data : AnyItem [0..*];
        item pagination : PaginationMetadata;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def PaginationMetadata :> BaseDTO {
        attribute page : Integer;
        attribute limit : Integer;
        attribute total : Integer;
        attribute totalPages : Integer;
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/Sale.model.ts";
    }
    item def SaleStats :> BaseDTO {
        attribute totalSales : Integer;
        attribute completedSales : Integer;
        attribute pendingSales : Integer;
        attribute totalRevenue : Real;
        attribute averageSalePrice : Real;
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Sale.model.ts";
    }
    item def MonthlySaleStats :> BaseDTO {
        attribute month : DateTime;
        attribute salesCount : Integer;
        attribute revenue : Real;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleFilters :> BaseDTO {
        attribute make : String [0..1];
        attribute model : String [0..1];
        attribute yearMin : Integer [0..1];
        attribute yearMax : Integer [0..1];
        attribute priceMin : Real [0..1];
        attribute priceMax : Real [0..1];
        attribute status : String [0..1];
        attribute condition : String [0..1];
        attribute search : String [0..1];
    }
}
