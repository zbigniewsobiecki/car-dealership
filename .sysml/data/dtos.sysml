package DataTransferObjects {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DomainEnums::*;
    doc /* Data Transfer Objects for API requests and responses. */
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
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def AuthResponse :> BaseDTO {
        item user : User;
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
    item def PaginationMetadata :> BaseDTO {
        attribute page : Integer;
        attribute limit : Integer;
        attribute total : Integer;
        attribute totalPages : Integer;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/api/responses.types.ts";
    }
    item def PaginatedResponse :> BaseDTO {
        item data : AnyItem [0..*];
        item pagination : PaginationMetadata;
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
        attribute stateValue : String [0..1];
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        item def CreateCustomerDto :> BaseDTO {
            attribute firstName : String;
            attribute lastName : String;
            attribute email : String [0..1];
            attribute phone : String [0..1];
            attribute address : String [0..1];
            attribute city : String [0..1];
            attribute state : String [0..1];
            attribute zipCode : String [0..1];
            attribute notes : String [0..1];
        }
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/customer.types.ts";
    }
    item def UpdateCustomerDto :> CreateCustomerDto;
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def CreateVehicleDto :> BaseDTO {
        attribute vin : String;
        attribute make : String;
        attribute model : String;
        attribute year : Integer;
        attribute price : Real;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def UpdateVehicleDto :> CreateVehicleDto;

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def CreateUserDto :> BaseDTO {
        attribute email : String;
        attribute password : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : String;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def UpdateUserDto :> CreateUserDto;
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
        attribute notes : String [0..1];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/sale.types.ts";
    }
    item def UpdateSaleDto :> CreateSaleDto;
}
