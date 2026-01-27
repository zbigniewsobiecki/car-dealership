package DomainEntities {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    item def User :> BaseEntity {
        attribute email : String;
        attribute firstName : String;
        attribute lastName : String;
        attribute role : DomainEnums::UserRole;
        attribute isActive : Boolean;
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
        attribute stateProvince : String [0..1];
        attribute zipCode : String [0..1];
        attribute notes : String [0..1];
        attribute createdBy : Identifier [0..1];
        attribute state : String [0..1];
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
        attribute status : DomainEnums::VehicleStatus;
        attribute condition : DomainEnums::VehicleCondition [0..1];
        attribute bodyType : String [0..1];
        attribute transmission : String [0..1];
        attribute fuelType : String [0..1];
        attribute engine : String [0..1];
        attribute drivetrain : String [0..1];
        attribute exteriorColor : String [0..1];
        attribute interiorColor : String [0..1];
        attribute features : JSON [0..1];
        attribute description : String [0..1];
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
        attribute status : DomainEnums::SaleStatus;
        attribute notes : String [0..1];
    }

    connection def CustomerSales {
        end [1] customer:Customer;
        end [0..*] sales:Sale;
    }

    connection def VehicleSale {
        end [1] vehicle:Vehicle;
        end [0..1] sale:Sale;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    item def VehicleImage :> BaseEntity {
        attribute url : String;
        attribute isPrimary : Boolean;
        attribute order : Integer;
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Vehicle.model.ts";
    }
    item def VehicleStats :> BaseDTO {
        attribute total : Integer;
        attribute available : Integer;
        attribute sold : Integer;
        attribute reserved : Integer;
        attribute maintenance : Integer;
        attribute totalInventoryValue : Real;
    }
}
