package DomainEntities {
    import DataTransferObjects::*;
    import SysMLPrimitives::*;
    import DomainEnums::*;
    doc /* Core domain entities for the Car Dealership system. */
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def User :> BaseEntity {
        attribute email : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : UserRole;
        attribute isActive : Boolean;
        item def User :> BaseEntity {
            attribute email : String;
            attribute firstName : String;
            attribute lastName : String;
            attribute role : UserRole;
            attribute isActive : Boolean;
            attribute :>> createdAt : DateTime [1..1];
            attribute :>> updatedAt : DateTime [1..1];
        }
    }
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
        attribute stateValue : String [0..1];
        // Renamed from 'state' (reserved)
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        attribute createdBy : Identifier [0..1];
        item def Customer :> BaseEntity {
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
            attribute :>> createdAt : DateTime [1..1];
            attribute :>> updatedAt : DateTime [1..1];
        }
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleImage {
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
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    item def UserWithPassword :> User {
        doc /* Internal user representation including password hash for authentication. */
        attribute passwordHash : String;
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    part def UserModel :> DataModule {
        doc /* Data access object for User entities. */
        action findById {
            in id : Identifier;
            out user : User [0..1];
        }

        action findByEmail {
            in email : String;
            out user : UserWithPassword [0..1];
        }

        action findAll {
            out users : User [0..*];
        }

        action create {
            in data : CreateUserDto;
            in passwordHash : String;
            out user : User;
        }

        action update {
            in id : Identifier;
            in data : UpdateUserDto;
            out user : User [0..1];
        }

        action delete {
            in id : Identifier;
            out success : Boolean;
        }
    }
}
