package DomainEntities {
    import DomainEnums::*;
    import SysMLPrimitives::*;
    import DataTransferObjects::*;

    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    item def User :> BaseEntity {
        doc /* User domain entity representing staff members. */
        attribute email : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : UserRole;
        attribute isActive : Boolean;
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/Customer.model.ts";
    }
    item def Customer :> BaseEntity {
        doc /* Customer domain entity for dealership clients. */
        attribute firstName : String;
        attribute lastName : String;
        attribute email : String [0..1];
        attribute phone : String [0..1];
        attribute address : String [0..1];
        attribute city : String [0..1];
        attribute state : String [0..1];
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        attribute createdBy : Identifier [0..1];
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Customer.model.ts";
    }
    action def CustomerModelOperations {
        action findAll {
            out customers : Customer [0..*];
        }
        action findById {
            in id : Identifier;
            out customer : Customer [0..1];
        }
        action create {
            in data : CreateCustomerDto;
            in createdBy : Identifier;
            out customer : Customer;
        }
        action update {
            in id : Identifier;
            in data : UpdateCustomerDto;
            out customer : Customer [0..1];
        }
        action delete {
            in id : Identifier;
            out success : Boolean;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/Sale.model.ts";
    }
    item def Sale :> BaseEntity {
        doc /* Sale domain entity representing a vehicle transaction. */
        attribute vehicleId : Identifier;
        attribute customerId : Identifier;
        attribute salespersonId : Identifier;
        attribute salePrice : Real;
        attribute saleDate : DateTime;
        attribute paymentMethod : String [0..1];
        attribute financingDetails : JSON [0..1];
        attribute tradeInVehicle : String [0..1];
        attribute tradeInValue : Real [0..1];
        attribute downPayment : Real [0..1];
        attribute status : SaleStatus;
        attribute notes : String [0..1];
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Sale.model.ts";
    }
    action def SaleModelOperations {
        action findAll {
            out sales : Sale [0..*];
        }
        action findById {
            in id : Identifier;
            out sale : Sale [0..1];
        }
        action create {
            in data : CreateSaleDto;
            out sale : Sale;
        }
        action getStats {
            out totalSales : Integer;
            out totalRevenue : Real;
        }
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleImage :> BaseDTO {
        attribute id : Identifier;
        attribute url : URL;
        attribute isPrimary : Boolean;
        attribute order : Integer;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def Vehicle :> BaseEntity {
        attribute vin : String;
        attribute make : String;
        attribute model : String;
        attribute year : Integer;
        attribute color : String;
        attribute mileage : Integer [0..1];
        attribute price : Real;
        attribute status : VehicleStatus;
        attribute condition : VehicleCondition [0..1];
        item images : VehicleImage [0..*];
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleFilters :> BaseDTO {
        attribute make : String [0..1];
        attribute model : String [0..1];
        attribute priceMin : Real [0..1];
        attribute priceMax : Real [0..1];
        attribute status : VehicleStatus [0..1];
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/db.ts";
    }
    action def DbUtils {
        action testConnection {
            out success : Boolean;
        }
        action tableExists {
            in tableName : String;
            out exists : Boolean;
        }
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/index.ts";
    }
    package SharedTypesBarrel {
        doc /* Barrel file re-exporting all shared domain types, enums, and API DTOs. */
    }
}
