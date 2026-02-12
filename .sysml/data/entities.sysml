package DomainEntities {
    import DataModel::BaseEntity;
    import DataModel::*;
    import DataModel::BaseDTO;
    import DomainEnums::*;
    import SysMLPrimitives::*;
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/customer.types.ts";
    }
    item def Customer :> BaseEntity {
        attribute firstName : String;
        attribute lastName : String;
        attribute email : String [0..1];
        attribute phone : String [0..1];
        attribute address : String [0..1];
        attribute city : String [0..1];
        attribute stateProvince : String [0..1];
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        attribute createdBy : Identifier [0..1];
        attribute createdAt : DateTime;
        attribute updatedAt : DateTime;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/sale.types.ts";
    }
    item def Sale :> BaseEntity {
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
        attribute createdAt : DateTime;
        attribute updatedAt : DateTime;
    }

    connection def CustomerSales {
        end [1] customer:Customer;
        end [0..*] sales:Sale;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def User :> BaseEntity {
        attribute email : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : UserRole;
        attribute isActive : Boolean;
        attribute createdAt : DateTime;
        attribute updatedAt : DateTime;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleImage :> BaseEntity {
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
        attribute cost : Real [0..1];
        attribute status : VehicleStatus;
        attribute condition : VehicleCondition [0..1];
        attribute bodyType : String [0..1];
        attribute transmission : String [0..1];
        attribute fuelType : String [0..1];
        attribute engine : String [0..1];
        attribute drivetrain : String [0..1];
        attribute exteriorColor : String [0..1];
        attribute interiorColor : String [0..1];
        attribute features : JSON [0..1];
        attribute description : String [0..1];
        item images : VehicleImage [0..*];
        attribute dateAcquired : DateTime [0..1];
        attribute createdBy : Identifier [0..1];
        attribute createdAt : DateTime;
        attribute updatedAt : DateTime;
    }

    connection def VehicleSales {
        end [1] vehicle:Vehicle;
        end [0..*] sales:Sale;
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/Customer.model.ts";
    }
    item def CustomerModelRow :> BaseDTO {
        doc /* Database row mapping for customers. DB columns use snake_case. */
        attribute id : Identifier;
        attribute first_name : String;
        attribute last_name : String;
        attribute email : String [0..1];
        attribute phone : String [0..1];
        attribute address : String [0..1];
        attribute city : String [0..1];
        attribute state : String [0..1];
        attribute zip_code : String [0..1];
        attribute notes : String [0..1];
        attribute created_at : DateTime;
        attribute updated_at : DateTime;
        attribute created_by : Identifier [0..1];
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    item def UserWithPassword :> User {
        doc /* Internal user representation with password hash */
        attribute passwordHash : String;
    }

    connection def UserCreatedVehicles {
        end [1] creator:User;
        end [0..*] vehicles:Vehicle;
    }

    connection def UserCreatedCustomers {
        end [1] creator:User;
        end [0..*] customers:Customer;
    }
}
